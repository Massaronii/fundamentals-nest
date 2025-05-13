import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionAttachmentList } from "@/domain/forum/enterprise/entities/question-attachment-list";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion, Prisma} from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create({
            title: raw.title,
            content: raw.content,
            slug: Slug.create(raw.slug),
            authorId: new UniqueEntityId(raw.authorId),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
            attachments: new QuestionAttachmentList(),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ? raw.updatedAt : null,
        }, 
        new UniqueEntityId(raw.id),)
    }

    static toPersistence(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            title: question.title,
            content: question.content,
            slug: question.slug.value,
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}

