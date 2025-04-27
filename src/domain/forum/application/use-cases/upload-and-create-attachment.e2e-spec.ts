import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

// sut = system under test
describe('Upload and create attachment', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader()
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentRepository, fakeUploader)
  })

  it('Should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(expect.objectContaining({
      attachment: inMemoryAttachmentRepository.items[0],
    }))
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(expect.objectContaining({
      fileName: 'profile.png',
    }))
  })

  it('Should not be able to an attachment with invalid file type', async () => {
    const result = await sut.execute({
        fileName: 'profile.mp3',
        fileType: 'audio/mpeg',
        body: Buffer.from(''),
      })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
