import { Uploader, UploaderProps } from "@/domain/forum/application/storage/uploader";
import { randomUUID } from "node:crypto";

interface Upload {
    fileName: string;
    url: string;
}

export class FakeUploader implements Uploader {

    public uploads: Upload[] = []

    async upload({ fileName }: UploaderProps): Promise<{ url: string; }> {
        const url = `https://fake-url/${fileName}-${randomUUID()}`

        this.uploads.push({
            fileName,
            url
        })

        return {
            url
        }
    }
}