import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerCommentUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentUseCaseReponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseReponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
        page,
      })

    return right({
      comments,
    })
  }
}
