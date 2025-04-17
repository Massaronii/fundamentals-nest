import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/jwt-auth-guard";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { number, z } from "zod";

const pageQueryParamSchema = z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {

    constructor(private prisma: PrismaService) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const PERPAGE = 20

        const questions = await this.prisma.question.findMany({
            take: PERPAGE,
            skip: (page - 1) * 1,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { questions };
    }
}
