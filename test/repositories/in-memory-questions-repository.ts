import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryStudentRepository } from './in-memory-students-repository'
import { InMemoryAttachmentRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentRepository,
    private studentsRepository: InMemoryStudentRepository,
  ) { }


  async findDetailsBySlug(slug: string) {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find(
      (student) => student.id.equals(question.authorId),
    )

    if (!author) {
      throw new Error(`Author with id  ${question.authorId.toString()} does not exist`)
    }

    const questionAttachments = this.questionAttachmentsRepository
      .items.filter((item) => item.questionId.equals(question.id))

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find(
        (attachment) => attachment.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(`Attachment with id  ${questionAttachment.attachmentId.toString()} does not exist`)
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question;

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string) {
    const question = this.items.find(
      (question) => question.id.toString() === id,
    )

    if (!question) {
      return null
    }

    return question
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findBySlug(slug: string) {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
