import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

import { DocumentTypeWithSameName } from '../errors/document-type-already-exits'
import { DocumentTypesRepository } from '../repositories/document-types-repository'

interface EditDocumentTypeRequest {
  name?: DocumentType['name']
  description?: DocumentType['description']
  documentTypeId: string
}

type EditDocumentTypeResponse = Either<
  ResourceNotFoundError,
  {
    documentType: DocumentType
  }
>
@Injectable()
export class EditCompanyTypeDocumentUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    name,
    description,
    documentTypeId,
  }: EditDocumentTypeRequest): Promise<EditDocumentTypeResponse> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      return failure(new ResourceNotFoundError('Document type'))
    }

    if (name) {
      const documentTypeName =
        await this.documentTypesRepository.findByName(name)

      if (documentTypeName) {
        return failure(new DocumentTypeWithSameName(name))
      }
    }

    documentType.name = name ?? documentType.name
    documentType.description = description ?? documentType.description

    await this.documentTypesRepository.save(documentType)

    return success({ documentType })
  }
}
