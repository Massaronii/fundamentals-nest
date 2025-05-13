import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {

    constructor(private prisma: PrismaService) { }

    async create(attachment: Attachment): Promise<void> {

        const data = PrismaAttachmentMapper.toPersistence(attachment);

        await this.prisma.attachment.create({
            data,
        });
    }
}