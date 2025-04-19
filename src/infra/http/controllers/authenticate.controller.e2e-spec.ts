import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest"
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

describe('Authjenticate (E2E)', () => {

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

    test('[POST] /sessions', async () => {
        await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: await hash('password', 8),
            },
        });

        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'john@example.com',
                password: 'password',
            })

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('acess_token');
        expect(response.body).toEqual({
            acess_token: expect.any(String),
        });
    });

});