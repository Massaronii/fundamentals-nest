import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest"

describe('Create questions Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);

        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[POST] /questions', async () => {
       const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: await hash('password', 8),
            },
        });
    
       const acessToken = jwt.sign({ sub: user.id })
       
        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                title: 'new question',
                content: 'question content',
            })

        expect(response.statusCode).toBe(201);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'new question',
            },
        });

        expect(questionOnDatabase).toBeTruthy();
    });

});