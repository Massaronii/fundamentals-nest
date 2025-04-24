import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller('/answer/comments/:id')
export class DeleteAnswerCommentController {

    constructor(private deleteAnswer: DeleteAnswerCommentAnswerUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerCommentId: string,
    ) {
        const userId = user.sub;

        const result = await this.deleteAnswer.execute({
            answerCommentId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
