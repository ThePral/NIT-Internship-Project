import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QueueService } from '../../src/queue/queue.service';

describe('AdminController (PATCH users/:id)', () => {
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

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    const university = await prisma.university.create({
      data: {
        name: 'TU Berlin',
        grade: 1.5,
      },
    });

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

    const admin = await prisma.admin.create({
      data: {
        username: 'admin1',
        hash_password: 'hashedpassword',
      },
    });

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
  it('should update user username (admin)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/admins/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'updated_user',
        new_password: 'newSecurePass123',
      })
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe('updated_user');

    expect(response.body.hash_password).toBeUndefined();

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(updatedUser?.username).toBe('updated_user');
  });

  // =============================
  // NOT FOUND
  // =============================
  it('should return 404 if user does not exist', async () => {
    await request(app.getHttpServer())
      .patch('/admins/users/999999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'test',
      })
      .expect(404);
  });

  // =============================
  // BAD REQUEST (VALIDATION)
  // =============================
  it('should return 400 for invalid data', async () => {
    await request(app.getHttpServer())
      .patch(`/admins/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'a', // too short → MinLength(3)
      })
      .expect(400);
  });

  // =============================
  // NO TOKEN
  // =============================
  it('should return 401 without token', async () => {
    await request(app.getHttpServer())
      .patch(`/admins/users/${userId}`)
      .send({
        username: 'updated_user',
      })
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
      .patch(`/admins/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        username: 'updated_user',
      })
      .expect(401);
  });
});