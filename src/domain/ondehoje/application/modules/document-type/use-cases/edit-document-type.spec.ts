import { makeDocumentType } from 'test/factories/make-document-type'
import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DocumentTypeWithSameName } from '../errors/document-type-already-exits'
import { EditCompanyTypeDocumentUseCase } from './edit-document-type'

let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: EditCompanyTypeDocumentUseCase

describe('Edit document type', () => {
  beforeEach(() => {
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository()

    sut = new EditCompanyTypeDocumentUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to edit document type', async () => {
    const documentType = makeDocumentType()
    await inMemoryDocumentTypesRepository.create(documentType)

    const result = await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
      documentTypeId: documentType.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.documentType).toMatchObject({
        name: 'CNPJ',
      })
    }
  })

  it('should not be able to edit document type that does not exist', async () => {
    const result = await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
      documentTypeId: 'non-existing-id',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit document type with the same name', async () => {
    const documentType = makeDocumentType({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })
    await inMemoryDocumentTypesRepository.create(documentType)

    const documentType2 = makeDocumentType({
      name: 'CNPJuiouoi',
      description: 'Documento do CNPJ',
    })
    const documentType2Id = documentType2.id.toString()
    await inMemoryDocumentTypesRepository.create(documentType2)

    const result = await sut.execute({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
      documentTypeId: documentType2Id,
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(DocumentTypeWithSameName)
  })
})
