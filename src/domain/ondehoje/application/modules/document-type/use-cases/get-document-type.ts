import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

import { DocumentTypesRepository } from '../repositories/document-types-repository'

interface GetCDocumentTypeRequest {
  documentTypeId: string
}

type GetDocumentTypeResponse = Either<
  ResourceNotFoundError,
  {
    documentType: DocumentType
  }
>
@Injectable()
export class GetDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    documentTypeId,
  }: GetCDocumentTypeRequest): Promise<GetDocumentTypeResponse> {
    const documentType =
      await this.documentTypesRepository.findById(documentTypeId)

    if (!documentType) {
      return failure(new ResourceNotFoundError('Document type'))
    }

    return success({ documentType })
  }
}
