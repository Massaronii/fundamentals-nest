import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account-controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { CryptographyModule } from "../cryptography/cryptography.module";

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionController
    ],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        AuthenticateStudentUseCase,
        RegisterStudentUseCase
    ],
})
export class HttpModule { }