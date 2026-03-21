import { makeDocumentType } from 'test/factories/make-document-type'
import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'

import { ListDocumentTypeUseCase } from './list-document-type'

let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository

let sut: ListDocumentTypeUseCase

describe('List document type', () => {
  beforeEach(() => {
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository()

    sut = new ListDocumentTypeUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to list document type', async () => {
    const documentType = makeDocumentType()
    await inMemoryDocumentTypesRepository.create(documentType)

    const result = await sut.execute()

    if (result.isSuccess()) {
      expect(result.value.documentTypes).toHaveLength(1)
    }
  })
})
