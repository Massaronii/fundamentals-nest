import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let sut: CommentOnQuestionUseCase

// sut = system under test
describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository,
    )

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentRepository)

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('Should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'new content',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'new content',
    )
  })
})
