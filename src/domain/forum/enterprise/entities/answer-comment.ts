import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps } from './comment'
import { AnswerCommentsCreatedEvent } from '../events/answer-comments-created'
import { AggregateRoot } from '@/core/entities/aggregate-root'
export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}
export class AnswerComment extends AggregateRoot<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(
        new AnswerCommentsCreatedEvent(answerComment),
      )
    }

    return answerComment
  }
}
