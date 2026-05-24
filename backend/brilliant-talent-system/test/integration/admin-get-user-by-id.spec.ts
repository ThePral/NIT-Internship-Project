import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QueueService } from '../../src/queue/queue.service';

describe('AdminController (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    // -----------------------------
    // 1. Create required University
    // -----------------------------
    const university = await prisma.university.create({
      data: {
        name: 'TU Berlin',
        grade: 1.5,
      },
    });

    // -----------------------------
    // 2. Create User (FULL SCHEMA)
    // -----------------------------
    const user = await prisma.user.create({
      data: {
        username: 'user1',
        hash_password: 'secret_hash',
        birthDate: new Date('2000-01-01'),
        nationalCode: '1234567890',
        grade: 18.5,
        majorName: 'Computer Science',
        isLocal: true,
        universityId: university.id,
      },
    });

    userId = user.id;

    // -----------------------------
    // 3. Create Admin
    // -----------------------------
    const admin = await prisma.admin.create({
      data: {
        username: 'admin1',
        hash_password: 'hashedpassword',
      },
    });

    // -----------------------------
    // 4. Generate ADMIN JWT
    // -----------------------------
    adminToken = jwtService.sign({
      sub: admin.id,
      username: admin.username,
      role: 'admin',
    });
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany();
      await prisma.university.deleteMany();
      await prisma.admin.deleteMany();
    } finally {
      await app.close();
      await prisma.$disconnect();
    }
  });

  // =============================
  // SUCCESS CASE
  // =============================
  it('should get user by id (admin)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/admins/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe('user1');

    // SECURITY CHECK
    expect(response.body.hash_password).toBeUndefined();
  });

  // =============================
  // NOT FOUND
  // =============================
  it('should return 404 if user not found', async () => {
    await request(app.getHttpServer())
      .get('/admins/users/999999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  // =============================
  // NO TOKEN
  // =============================
  it('should return 401 without token', async () => {
    await request(app.getHttpServer())
      .get(`/admins/users/${userId}`)
      .expect(401);
  });

  // =============================
  // WRONG ROLE
  // =============================
  it('should return 401 for non-admin role', async () => {
    const userToken = jwtService.sign({
      sub: userId,
      username: 'user1',
      role: 'user',
    });

    await request(app.getHttpServer())
      .get(`/admins/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401);
  });
});