import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(questionId: string): Promise<void>
}
