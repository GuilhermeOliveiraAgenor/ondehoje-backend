import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'

import { DocumentTypeWithSameName } from '../errors/document-type-already-exits'
import { RegisterDocumentTypeUseCase } from './create-document-type'

let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: RegisterDocumentTypeUseCase

describe('Register document type', () => {
  beforeEach(() => {
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository()
    sut = new RegisterDocumentTypeUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to register document type', async () => {
    const result = await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.documentType).toMatchObject({
        name: 'CNPJ',
      })
    }
  })

  it('should not be able to register document type twice with same name', async () => {
    await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })

    const result = await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryDocumentTypesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(DocumentTypeWithSameName)
  })
})
