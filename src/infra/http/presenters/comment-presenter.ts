import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class CommentPresenter {
    static toHTTP(comment: QuestionComment) {
        return {
          id: comment.id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
        };
      }

      static toHTTPAnswer(comment: AnswerComment) {
        return {
          id: comment.id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
        };
      }
}