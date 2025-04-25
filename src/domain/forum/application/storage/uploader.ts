export interface UploaderProps {
    fileName: string
    fileType: string
    body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploaderProps): Promise<{url: string}>
}