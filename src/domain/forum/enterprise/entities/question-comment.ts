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

  get updateAt() {
    return this.props.updateAt
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  static create(
    props: Optional<QuestionCommentProps, 'createAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createAt ?? new Date(),
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
