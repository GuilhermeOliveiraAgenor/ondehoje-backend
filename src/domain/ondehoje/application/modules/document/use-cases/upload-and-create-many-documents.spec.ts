import { makeDocumentType } from 'test/factories/make-document-type'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { FakeUploader } from 'test/storage/fake-storage'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { InvalidDocumentTypeError } from '../errors/invalid-document-type-error'
import { UploadAndCreateManyDocumentsUseCase } from './upload-and-create-many-documents'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateManyDocumentsUseCase

describe('Upload and create document Use Case', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateManyDocumentsUseCase(
      inMemoryDocumentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an document', async () => {
    const documentType = makeDocumentType()

    const result = await sut.execute({
      documents: [
        {
          documentTypeId: documentType.id.toString(),
          name: 'Profile Picture',
          fileName: 'profile.png',
          fileType: 'image/png',
          body: Buffer.from(''),
        },
      ],
      requestedBy: new UniqueEntityID('user-123'),
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      documentsIds: expect.arrayContaining([expect.any(String)]),
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload and create an document with invalid file type', async () => {
    const documentType = makeDocumentType()

    const result = await sut.execute({
      documents: [
        {
          documentTypeId: documentType.id.toString(),
          name: 'Profile Picture',
          fileName: 'profile.mp3',
          fileType: 'audio/mpeg',
          body: Buffer.from(''),
        },
      ],
      requestedBy: new UniqueEntityID('user-123'),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDocumentTypeError)
  })
})
