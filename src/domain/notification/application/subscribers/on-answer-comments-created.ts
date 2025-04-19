import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswerCommentsCreatedEvent } from '@/domain/forum/enterprise/events/answer-comments-created'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnAnswerCommentsCreated implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentsNotification.bind(this),
      AnswerCommentsCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentsNotification({
    answerComments,
  }: AnswerCommentsCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComments.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `New answer comments on "${answer.content.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
