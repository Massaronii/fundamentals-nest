import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaService } from "../prisma.service";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
    constructor(private prisma: PrismaService) { }

    async create(answerComment: AnswerComment): Promise<void> {
        const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

        await this.prisma.comment.create({
            data
        });
    }

    async findById(id: string): Promise<AnswerComment | null> {
        const answerComment = await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });

        if (!answerComment) {
            return null;
        }

        return PrismaAnswerCommentMapper.toDomain(answerComment);
    }

    async delete(answerComment: AnswerComment): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: answerComment.id.toString(),
            },
        });
    }

    async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
        const answersComment = await this.prisma.comment.findMany({
            where: {
                answerId: answerId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return answersComment.map(PrismaAnswerCommentMapper.toDomain);
    }

    async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
        const answerComments = await this.prisma.comment.findMany({
            where: {
                answerId,
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

        return answerComments.map(PrismaCommentWithAuthorMapper.toDomain);
    }
}