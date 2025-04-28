import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository {

  public items: QuestionAttachment[] = []

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachment = this.items.filter(
      (item) => {
        return !attachments.some(attachment => attachment.equals(item))
      }
    )

    this.items = questionAttachment

  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachment
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachment
  }

}