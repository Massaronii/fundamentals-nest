import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps } from './comment'
import { AnswerCommentsCreatedEvent } from '../events/answer-comments-created'
import { AggregateRoot } from '@/core/entities/aggregate-root'
export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  createAt: Date
  updateAt?: Date
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

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get updateAt() {
    return this.props.updateAt
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  static create(
    props: Optional<AnswerCommentProps, 'createAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createAt ?? new Date(),
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
