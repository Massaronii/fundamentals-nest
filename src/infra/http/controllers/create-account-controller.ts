import { BadRequestException, ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { Public } from "@/infra/auth/public";

const createAccountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateAccountBody = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {

    constructor(private registerStudent: RegisterStudentUseCase) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountSchema))
    async handle(@Body() body: CreateAccountBody) {

        const { name, email, password } = body;

        const result = await this.registerStudent.execute({
            name,
            email,
            password,
        })

        
        if (result.isLeft()) {
            const error = result.value;

            switch (error.constructor) {
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message);
                default:
                    throw new BadRequestException(error.message);
            }
        }

    }
}