import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { QuestionComment } from '../entities/question-comment'

export class QuestionCommentsCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComments: QuestionComment

  constructor(questionComments: QuestionComment) {
    this.ocurredAt = new Date()
    this.questionComments = questionComments
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComments.id
  }
}
