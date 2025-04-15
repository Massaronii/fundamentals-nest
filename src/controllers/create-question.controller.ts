import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {

    constructor() { }

    @Post()
    async handle(@Req() request: Request) {
        return 'ok'
    }
}