import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'

import { Uploader } from '../../../storage/uploader'
import { InvalidDocumentTypeError } from '../errors/invalid-document-type-error'
import { DocumentsRepository } from '../repositories/documents-repository'

interface UploadAndCreateManyDocumentsUseCaseRequest {
  documents: Array<{
    documentTypeId: string
    name: string
    description?: string | null
    expiresAt?: Date | null
    fileName: string
    fileType: string
    body: Buffer
  }>
  requestedBy: UniqueEntityID
}

type UploadAndCreateManyDocumentsUseCaseResponse = Either<
  InvalidDocumentTypeError,
  {
    documentsIds: string[]
  }
>

@Injectable()
export class UploadAndCreateManyDocumentsUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    documents,
    requestedBy,
  }: UploadAndCreateManyDocumentsUseCaseRequest): Promise<UploadAndCreateManyDocumentsUseCaseResponse> {
    const documentsToUpload: Document[] = []

    for (const data of documents) {
      if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(data.fileType)) {
        return failure(new InvalidDocumentTypeError(data.fileType))
      }

      const { url } = await this.uploader.upload({
        fileName: data.fileName,
        fileType: data.fileType,
        body: data.body,
      })

      const document = Document.create({
        documentTypeId: new UniqueEntityID(data.documentTypeId),
        name: data.name,
        file: url,
        description: data.description,
        expiresAt: data.expiresAt,
        createdBy: requestedBy,
      })

      documentsToUpload.push(document)
    }

    await this.documentsRepository.createMany(documentsToUpload)

    return success({
      documentsIds: documentsToUpload.map((document) => document.id.toString()),
    })
  }
}
