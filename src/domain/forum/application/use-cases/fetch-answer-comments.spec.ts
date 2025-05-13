import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentUseCase

// sut = system under test
describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentRepository)
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should be able to get fetch answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentRepository.items.push(student)


    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)

    await inMemoryAnswerCommentRepository.create(comment2)

    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('Should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentRepository.items.push(student)
    
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-id'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
