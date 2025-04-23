import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {

    constructor(private prisma: PrismaService) { }

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachment = await this.prisma.attachment.findMany({
            where: {
                questionId,
            },
        })

        return questionAttachment.map(PrismaQuestionAttachmentMapper.toDomain);
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                questionId,
            },
        });
    }
}