import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import {Test} from '@nestjs/testing'
import * as pactum from 'pactum'


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile(); 

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false
    }));

    await app.init();
    await app.listen(process.env.E2E_PORT ?? 3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3333');
  })

  afterAll(() => {
    app.close();
  })

  it.todo('should pass');
});