import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch answer comments (E2E)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let answerCommentFactory: AnswerCommentFactory
    let questionFactory: QuestionFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        answerCommentFactory = moduleRef.get(AnswerCommentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /answers/:answerId/comments', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
            questionId: question.id,
        })

        const answerComments = await answerCommentFactory.makePrismaAnswerComment({
            authorId: user.id,
            answerId: answer.id,
        })

        const answerId = answer.id.toString()
    
        const response = await request(app.getHttpServer())
            .get(`/answers/${answerId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()


        expect(response.statusCode).toBe(200)
        expect(response.body.comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: answerComments.content,  // Verifica se o conteúdo do comentário na resposta é o mesmo do criado.
                }),
            ])
        );
    })
})