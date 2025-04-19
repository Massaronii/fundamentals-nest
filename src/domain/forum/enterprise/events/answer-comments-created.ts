import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { AnswerComment } from '../entities/answer-comment'

export class AnswerCommentsCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComments: AnswerComment

  constructor(answerComments: AnswerComment) {
    this.ocurredAt = new Date()
    this.answerComments = answerComments
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComments.id
  }
}
