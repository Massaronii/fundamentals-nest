import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Answer as PrismaAnswer, Prisma } from "@prisma/client";

export class PrismaAnswerMapper {
    static toDomain(raw: PrismaAnswer): Answer {
        return Answer.create({
            content: raw.content,
            questionId: new UniqueEntityId(raw.questionId),
            authorId: new UniqueEntityId(raw.authorId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ? raw.updatedAt : null,
        },
            new UniqueEntityId(raw.id),)
    }

    static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            id: answer.id.toString(),
            content: answer.content,
            questionId: answer.questionId.toString(),
            authorId: answer.authorId.toString(),
            createdAt: answer.createAt,
            updatedAt: answer.updateAt,
        }
    }
}

