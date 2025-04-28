import { Uploader, UploaderProps } from "@/domain/forum/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {

    private client: S3Client

    constructor(
       private envService: EnvService
    ) {
        const accountId = envService.get('CLOUDFLAR_ACCONT_ID')
        this.client = new S3Client({
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId: envService.get('AWS_ACESS_KEY_ID'),
                secretAccessKey: envService.get('AWS_SECRET_ACEES_KEY'),
            }
        })
    }
    
    async upload({
        fileName,
        fileType,
        body
    }: UploaderProps): Promise<{ url: string; }> {
        const uploadId = randomUUID()

        const uniqueFilName = `${uploadId}-${fileName}`

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.envService.get('AWS_BUCKET_NAME'),
                Key: uniqueFilName,
                Body: body,
                ContentType: fileType,
            })
        )

        return {
            url: uniqueFilName
        }
    }
}