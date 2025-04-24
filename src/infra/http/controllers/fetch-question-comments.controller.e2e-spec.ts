import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question comments (E2E)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let prisma: PrismaService
    let questionFactory: QuestionFactory
    let questionCommentFactory: QuestionCommentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        questionCommentFactory = moduleRef.get(QuestionCommentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/:questionId/comments', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const questionComments = await questionCommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id,
        })

        const response = await request(app.getHttpServer())
            .get(`/questions/${question.id.toString()}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()


        const commentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: questionComments.id.toString(),
            },
        });

        expect(commentOnDatabase).toBeTruthy();
        expect(response.statusCode).toBe(200)
        expect(response.body.comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: questionComments.content,  // Verifica se o conteúdo do comentário na resposta é o mesmo do criado.
                }),
            ])
        );
    })
})