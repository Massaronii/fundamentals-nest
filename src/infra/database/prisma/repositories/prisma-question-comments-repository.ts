import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";


@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionsCommentsRepository {

    constructor(private prisma: PrismaService) { }

    async create(questionComment: QuestionComment): Promise<void> {
        const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

        await this.prisma.comment.create({
            data
        });
    }

    async findById(id: string): Promise<QuestionComment | null> {
        const questionComment = await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });

        if (!questionComment) {
            return null;
        }

        return PrismaQuestionCommentMapper.toDomain(questionComment);
    }

    async delete(questionComment: QuestionComment): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: questionComment.id.toString(),
            },
        });
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
        const questionsComment = await this.prisma.comment.findMany({
            where: {
                questionId: questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return questionsComment.map(PrismaQuestionCommentMapper.toDomain);
    }

    async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
        const questionsComment = await this.prisma.comment.findMany({
            where: {
                questionId: questionId,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return questionsComment.map(PrismaCommentWithAuthorMapper.toDomain);
    }
}