import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest"
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe('Get question by slug (E2E)', () => {

    let app: INestApplication;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        studentFactory = moduleRef.get(StudentFactory);

        questionFactory = moduleRef.get(QuestionFactory);

        attachmentFactory = moduleRef.get(AttachmentFactory);

        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent({
            name: 'John Doe',
        });

        const acessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            title: 'question 1',
            slug: Slug.create("user.id",)
        })

        const attachment = await attachmentFactory.makePrismaAttachment({
            title: 'Some attachment',
        })

         await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        })

        const response = await request(app.getHttpServer())
            .get('/questions/user.id')
            .set('Authorization', `Bearer ${acessToken}`)
            .send()

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            question:
                expect.objectContaining({
                    title: 'question 1',
                    author: 'John Doe',
                    attachment: expect.arrayContaining([
                        expect.objectContaining({
                            title: 'Some attachment',
                        }),
                    ]),
                }),
        });
    });

});