import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { number, z } from "zod";
import { CommentPresenter } from "../presenters/comment-presenter";
import { FetchAnswerCommentUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {

    constructor(private fetchAnswerComments: FetchAnswerCommentUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string,
    ) {

        const result = await this.fetchAnswerComments.execute({
            page,
            answerId
        });


        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const comments = result.value.comments;

        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };

    }
}
