import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

const createAccountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateAccountBody = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
export class CreateAccountController {

    constructor(private prisma: PrismaService) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountSchema))
    async handle(@Body() body: CreateAccountBody) {

        const { name, email, password } = body;

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await hash(password, 8);

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    }
}