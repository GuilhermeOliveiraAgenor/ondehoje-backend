import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentType } from '@/domain/ondehoje/enterprise/entities/document-type'

import { DocumentTypeWithSameName } from '../errors/document-type-already-exits'
import { DocumentTypesRepository } from '../repositories/document-types-repository'

interface RegisterDocumentTypeRequest {
  name: DocumentType['name'] // campos
  description: DocumentType['description']
  createdBy?: string
}

type RegisterDocumentTypeResponse = Either<
  // retorna erro ou objeto
  DocumentTypeWithSameName,
  {
    documentType: DocumentType
  }
>
@Injectable()
export class RegisterDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute({
    name,
    description,
    createdBy,
  }: RegisterDocumentTypeRequest): Promise<RegisterDocumentTypeResponse> {
    // 1 - verificar tipos de tipos de documentos já cadastrados
    const documentTypeAlreadExists =
      await this.documentTypesRepository.findByName(name) // chama função

    if (documentTypeAlreadExists) {
      // se tiver linhas retornadas
      return failure(new DocumentTypeWithSameName(name))
    }
    // criar objeto
    const documentType = DocumentType.create({
      name,
      description,
      createdBy: new UniqueEntityID(createdBy),
    })
    // chama função create do repositorio
    await this.documentTypesRepository.create(documentType)

    return success({
      documentType,
    })
  }
}
