import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
    static toDomain(raw: PrismaAttachment): AnswerAttachment {

        if (!raw.answerId) {
            throw new Error('Invalid answer comment')
        }

        return AnswerAttachment.create({
            attachmentId: new UniqueEntityId(raw.id),
            answerId: new UniqueEntityId(raw.answerId),
        },
            new UniqueEntityId(raw.id),
        )
    }

    static toPersistenceUpdateMany(
        attachments: AnswerAttachment[],
    ): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map(attachment => attachment.attachmentId.toString());

        return {
            where: {
                id: {
                    in: attachmentIds,
                }
            },
            data: {
                answerId: attachments[0].answerId.toString(),
            }
        }
    }
}

