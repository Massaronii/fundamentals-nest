import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest"
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe('Edit questions Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[Put] /questions/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const acessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const attachment1 = await attachmentFactory.makePrismaAttachment()
        const attachment2 = await attachmentFactory.makePrismaAttachment()


        await questionAttachmentFactory.makePrismaQuestionAttachment({            
            questionId: question.id,
            attachmentId: attachment1.id,
        })

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            questionId: question.id,
            attachmentId: attachment2.id,
        })

        const attachment3 = await attachmentFactory.makePrismaAttachment()

        const questionId = question.id.toString()

        const response = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                title: 'new title',
                content: 'new content',
                attachments: [
                    attachment1.id.toString(),
                    attachment3.id.toString(),
                ]
            })

            console.log(attachment1.id.toString())
            console.log(response.body)

        expect(response.statusCode).toBe(204);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'new title',
                content: 'new content',
            },
        });

        expect(questionOnDatabase).toBeTruthy();

        const attachment1OnDatabase = await prisma.attachment.findMany({
            where: {
                questionId: questionOnDatabase?.id,
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