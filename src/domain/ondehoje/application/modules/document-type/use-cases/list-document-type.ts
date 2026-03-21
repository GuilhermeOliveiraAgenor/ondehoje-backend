import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

import { DocumentTypesRepository } from '../repositories/document-types-repository'

type ListDocumentTypeResponse = Either<
  null,
  {
    documentTypes: DocumentType[]
  }
>
@Injectable()
export class ListDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute(): Promise<ListDocumentTypeResponse> {
    const documentTypes = await this.documentTypesRepository.findMany()

    return success({
      documentTypes,
    })
  }
}
