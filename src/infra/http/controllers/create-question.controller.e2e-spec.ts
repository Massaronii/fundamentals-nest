import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest"
import { AttachmentFactory } from "test/factories/make-attachment";
import { StudentFactory } from "test/factories/make-student";

describe('Create questions Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService
    let attachmentFactory: AttachmentFactory
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, AttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        studentFactory = moduleRef.get(StudentFactory);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[POST] /questions', async () => {
        const user = await studentFactory.makePrismaStudent()

        const acessToken = jwt.sign({ sub: user.id.toString() })

        const attachment1 = await attachmentFactory.makePrismaAttachment()
        const attachment2 = await attachmentFactory.makePrismaAttachment()

        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                title: 'new question',
                content: 'question content',
                attachments: [
                    attachment1.id.toString(),
                    attachment2.id.toString()
                ],
            })

        expect(response.statusCode).toBe(201);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'new question',
            },
        });

        expect(questionOnDatabase).toBeTruthy();

        const attachment1OnDatabase = await prisma.attachment.findMany({
            where: {
                questionId: questionOnDatabase?.id,
            },
        });

        expect(attachment1OnDatabase).toHaveLength(2);
    });
});