import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentsCreatedEvent } from '@/domain/forum/enterprise/events/question-comments'

export class OnQuestionCommentsCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentsNotification.bind(this),
      QuestionCommentsCreatedEvent.name,
    )
  }

  private async sendNewQuestionCommentsNotification({
    questionComments,
  }: QuestionCommentsCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComments.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `New question comments on "${question.content.substring(0, 40).concat('...')}"`,
        content: question.excerpt,
      })
    }
  }
}
