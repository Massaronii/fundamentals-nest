import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchRecentQuestionsUseCase

// sut = system under test
describe('Fetch recent questions', () => {
  beforeEach(() => {

    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository
    )
    
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('Should be able to get fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 1, 1),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 1, 2),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2022, 1, 3),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toMatchObject([
      expect.objectContaining({
        props: expect.objectContaining({
          createdAt: new Date(2022, 1, 3),
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          createdAt: new Date(2022, 1, 2),
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          createdAt: new Date(2022, 1, 1),
        }),
      }),
    ])
  })

  it('Should be able to get fetch paginated recent questions', async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(3)
  })
})
