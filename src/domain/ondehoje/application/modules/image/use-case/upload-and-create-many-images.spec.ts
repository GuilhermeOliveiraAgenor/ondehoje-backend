import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { FakeUploader } from 'test/storage/fake-storage'

import { InvalidImageTypeError } from '../errors/invalid-image-type-error'
import { UploadAndCreateManyImagesUseCase } from './upload-and-create-many-images'

let inMemoryImagesRepository: InMemoryImagesRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateManyImagesUseCase

describe('Upload and create image Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateManyImagesUseCase(
      inMemoryImagesRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an image', async () => {
    const result = await sut.execute({
      images: [
        {
          fileName: 'profile.png',
          fileType: 'image/png',
          body: Buffer.from(''),
        },
      ],
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      images: expect.arrayContaining([
        expect.objectContaining({
          alt: 'profile.png',
          url: expect.any(String),
        }),
      ]),
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload and create an image with invalid file type', async () => {
    const result = await sut.execute({
      images: [
        {
          fileName: 'profile.mp3',
          fileType: 'audio/mpeg',
          body: Buffer.from(''),
        },
      ],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageTypeError)
  })
})
