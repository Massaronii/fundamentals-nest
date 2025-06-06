import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Controller('/question/comments/:id')
export class DeleteQuestionCommentController {

    constructor(private deleteQuestion: DeleteQuestionCommentQuestionUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionCommentId: string,
    ) {
        const userId = user.sub;

        const result = await this.deleteQuestion.execute({
            questionCommentId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
