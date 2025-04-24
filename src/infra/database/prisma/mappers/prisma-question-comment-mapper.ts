import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Comment as PrismaQuestionComment, Prisma } from "@prisma/client";

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaQuestionComment): QuestionComment {

        if (!raw.questionId) {
            throw new Error('Invalid question comment')
        }

        return QuestionComment.create({
            content: raw.content,
            authorId: new UniqueEntityId(raw.authorId),
            questionId: new UniqueEntityId(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ? raw.updatedAt : null,
        },
            new UniqueEntityId(raw.id),
        )
    }

    static toPersistence(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            content: questionComment.content,
            questionId: questionComment.questionId.toString(),
            authorId: questionComment.authorId.toString(),
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
        }
    }
}

