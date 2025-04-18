import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(questionId: string): Promise<void>
}
