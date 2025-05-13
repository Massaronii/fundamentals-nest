import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachment
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachment = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    this.items = answerAttachment
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachment = this.items.filter(
      (item) => {
        return !attachments.some(attachment => attachment.equals(item))
      }
    )

    this.items = answerAttachment
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

}
