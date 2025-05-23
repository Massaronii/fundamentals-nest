import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { OnQuestionCommentsCreated } from './on-question-comments-created'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe('On question comments created', () => {
  beforeEach(() => {

    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentRepository)

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentsCreated(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when an question comments is created', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    const questionComment = makeQuestionComment({ questionId: question.id })

    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
