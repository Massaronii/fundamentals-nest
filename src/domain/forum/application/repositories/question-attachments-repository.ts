import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
