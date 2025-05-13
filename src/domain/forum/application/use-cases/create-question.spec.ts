import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: CreateQuestionUseCase

// sut = system under test
describe('Create a question', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('Should be able to create an answer question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })

  it('Should persist attachment when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(
      inMemoryQuestionAttachmentsRepository.items,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ]),
    )
  })
})
