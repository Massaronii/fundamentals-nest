import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest"

describe('Create Account Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);

        await app.init();
    });

    test('[POST] /accounts', async () => {
        const response = await request(app.getHttpServer())
            .post('/accounts')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
            })

        expect(response.statusCode).toBe(201);

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: 'john@example.com',
            },
        });

        expect(userOnDatabase).toBeTruthy();
    });

});