import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest"
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachments";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Edit answer Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let answerAttachmentFactory: AnswerAttachmentFactory
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory, AttachmentFactory, AnswerAttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[PUT] /answers/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const acessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
            questionId: question.id,
        })

        const attachment1 = await attachmentFactory.makePrismaAttachment()
        const attachment2 = await attachmentFactory.makePrismaAttachment()

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            answerId: answer.id,
            attachmentId: attachment1.id,
        })

        await answerAttachmentFactory.makePrismaAnswerAttachment({
            answerId: answer.id,
            attachmentId: attachment2.id,
        })

        const attachment3 = await attachmentFactory.makePrismaAttachment()

        const answerId = answer.id.toString()

        const response = await request(app.getHttpServer())
            .put(`/answers/${answerId}`)
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                content: 'new content',
                attachments: [
                    attachment1.id.toString(),
                    attachment3.id.toString(),
                ]
            })

        expect(response.statusCode).toBe(204);

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {
                content: 'new content',
            },
        });

        expect(answerOnDatabase).toBeTruthy();

        const attachment1OnDatabase = await prisma.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id,
            },
        });

        expect(attachment1OnDatabase).toHaveLength(2);
        expect(attachment1OnDatabase).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: attachment1.id.toString() }),
                expect.objectContaining({ id: attachment3.id.toString() }),
            ]),
        );
    });
});