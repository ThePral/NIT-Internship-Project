import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QueueService } from '../../src/queue/queue.service';

describe('AdminController - GET /me', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let adminId: number;

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
    // Create admin in DB
    // -----------------------------
    const admin = await prisma.admin.create({
      data: {
        username: 'admin_me',
        hash_password: 'hashedpassword',
      },
    });

    adminId = admin.id;

    // -----------------------------
    // Create JWT (admin role required by guard)
    // -----------------------------
    adminToken = jwtService.sign({
      sub: admin.id,
      username: admin.username,
      role: 'admin',
    });
  });

  afterAll(async () => {
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  // =============================
  // SUCCESS CASE
  // =============================
  it('should return current admin (me)', async () => {
    const res = await request(app.getHttpServer())
      .get('/admins/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: adminId,
        username: 'admin_me',
        role: 'admin',
      }),
    );

    // security check
    expect(res.body.hash_password).toBeUndefined();
  });

  // =============================
  // NO TOKEN
  // =============================
  it('should return 401 without token', async () => {
    await request(app.getHttpServer())
      .get('/admins/me')
      .expect(401);
  });

  // =============================
  // INVALID ROLE TOKEN
  // =============================
  it('should return 401 for non-admin role', async () => {
    const userToken = jwtService.sign({
      sub: adminId,
      username: 'admin_me',
      role: 'user',
    });

    await request(app.getHttpServer())
      .get('/admins/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401);
  });
});