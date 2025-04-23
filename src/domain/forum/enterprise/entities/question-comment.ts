import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps } from './comment'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionCommentsCreatedEvent } from '../events/question-comments'
export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}
export class QuestionComment extends AggregateRoot<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(
        new QuestionCommentsCreatedEvent(questionComment),
      )
    }

    return questionComment
  }
}
