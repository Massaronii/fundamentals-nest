import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest"
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe('Delete questions comments Controller (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService
    let questionFactory: QuestionFactory
    let studentFactory: StudentFactory
    let questionCommentFactory: QuestionCommentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        questionCommentFactory = moduleRef.get(QuestionCommentFactory);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[Delete] /questions/comments/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const acessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const questionComments = await questionCommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id,
        })

        const questionCommentsId = questionComments.id.toString()

        const response = await request(app.getHttpServer())
            .delete(`/question/comments/${questionCommentsId}`)
            .set('Authorization', `Bearer ${acessToken}`)
            .send()

        expect(response.statusCode).toBe(204);

        const commentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: questionCommentsId,
            },
        });

        expect(commentOnDatabase).toBeNull();
    });
});