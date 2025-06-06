import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {

    constructor(private prisma: PrismaService,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) { }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        const answer = await this.prisma.answer.findMany({
            where: {
                questionId: questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return answer.map(PrismaAnswerMapper.toDomain);
    }

    async save(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPersistence(answer);

        await Promise.all([
            this.prisma.answer.update({
                where: {
                    id: data.id,
                },
                data
            }),
            this.answerAttachmentsRepository.createMany(
                answer.attachments?.getNewItems(),
            ),
            this.answerAttachmentsRepository.deleteMany(
                answer.attachments?.getRemovedItems(),
            ),
        ]);

        DomainEvents.dispatchEventsForAggregate(answer.id);

    }

    async findById(id: string): Promise<Answer | null> {
        const answer = await this.prisma.answer.findUnique({
            where: {
                id,
            },
        });

        if (!answer) {
            return null;
        }

        return PrismaAnswerMapper.toDomain(answer);
    }

    async create(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPersistence(answer);

        await this.prisma.answer.create({
            data
        });

        await this.answerAttachmentsRepository.createMany(
            answer.attachments.getItems(),
        );

        DomainEvents.dispatchEventsForAggregate(answer.id);
    }

    async delete(answer: Answer): Promise<void> {
        await this.prisma.answer.delete({
            where: {
                id: answer.id.toString(),
            },
        });
    }
}
