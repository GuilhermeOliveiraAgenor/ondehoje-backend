import { makeDocumentType } from 'test/factories/make-document-type'
import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetDocumentTypeUseCase } from './get-document-type'

let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository

let sut: GetDocumentTypeUseCase

describe('List document type', () => {
  beforeEach(() => {
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository()

    sut = new GetDocumentTypeUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to get document type', async () => {
    const documentType = makeDocumentType({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })
    const id = documentType.id.toString()
    await inMemoryDocumentTypesRepository.create(documentType)

    const result = await sut.execute({
      documentTypeId: id,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.documentType).toMatchObject({
        name: 'CNPJ',
        description: 'Documento do CNPJ',
      })
    }
  })

  it('should not be able to get document type not exists', async () => {
    const result = await sut.execute({ documentTypeId: '0' })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
