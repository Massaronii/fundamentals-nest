import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Comment as PrismaAnswerComment, Prisma } from "@prisma/client";

export class PrismaAnswerCommentMapper {
    static toDomain(raw: PrismaAnswerComment): AnswerComment {

        if(!raw.answerId) {
            throw new Error('Invalid answer comment')
        }

        return AnswerComment.create({
            content: raw.content,
            authorId: new UniqueEntityId(raw.authorId),
            answerId: new UniqueEntityId(raw.answerId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ? raw.updatedAt : null,
        },
            new UniqueEntityId(raw.id),)
    }

    static toPersistence(answerComment: AnswerComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: answerComment.id.toString(),
            content: answerComment.content,
            answerId: answerComment.answerId.toString(),
            authorId: answerComment.authorId.toString(),
            createdAt: answerComment.createdAt,
            updatedAt: answerComment.updatedAt,
        }
    }
}

