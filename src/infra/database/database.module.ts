import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { CacheModule } from "../cache/cache-module";

@Module({
    imports: [CacheModule],
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository,
        },
        {
            provide: StudentsRepository,
            useClass: PrismaStudentsRepository,
        },
        {
            provide: QuestionsCommentsRepository,
            useClass: PrismaQuestionCommentsRepository
        },
        {
            provide: QuestionAttachmentsRepository,
            useClass: PrismaQuestionAttachmentsRepository,
        },
        {
            provide: AnswersRepository,
            useClass: PrismaAnswersRepository
        },
        {
            provide: AnswerCommentsRepository,
            useClass: PrismaAnswerCommentsRepository
        },
        {
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository
        },
        {
            provide: AttachmentsRepository,
            useClass: PrismaAttachmentRepository,
        },
        {
            provide: NotificationsRepository,
            useClass: PrismaNotificationsRepository,
        }
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        StudentsRepository,
        QuestionsCommentsRepository,
        QuestionAttachmentsRepository,
        AnswersRepository,
        AnswerCommentsRepository,
        AnswerAttachmentsRepository,
        AttachmentsRepository,
        NotificationsRepository
    ],
})
export class DatabaseModule { }