import { Either, left, right } from '@/core/either'
import { QuestionsCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteQuestionCommentQuestionUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentQuestionUseCaseReponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteQuestionCommentQuestionUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository,
  ) { }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentQuestionUseCaseRequest): Promise<DeleteQuestionCommentQuestionUseCaseReponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right(null)
  }
}
