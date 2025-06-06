import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest"
import { StudentFactory } from "test/factories/make-student";

describe('Authjenticate (E2E)', () => {

    let app: INestApplication;
    let studentFactory: StudentFactory
    
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        studentFactory = moduleRef.get(StudentFactory);

        await app.init();
    });

    test('[POST] /sessions', async () => {
        await studentFactory.makePrismaStudent({
            email: 'john@example.com',
            password: await hash('password', 8),
        })

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