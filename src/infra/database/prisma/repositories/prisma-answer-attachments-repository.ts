import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {

    constructor(private prisma: PrismaService) { }

     async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return;
        }

        const attachmentIds = attachments.map(attachment => attachment.attachmentId.toString());

        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentIds,
                }
            }
        });
    }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {       
        if (attachments.length === 0) {
            return;
        }

        const data = PrismaAnswerAttachmentMapper.toPersistenceUpdateMany(attachments);

        await this.prisma.attachment.updateMany(data);
    }

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachment = await this.prisma.attachment.findMany({
            where: {
                answerId,
            },
        })

        return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain);
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                answerId,
            },
        });
    }
}