import { BadRequestException, Controller, Get } from '@nestjs/common'

import { ListDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/list-document-type'

import { DocumentTypePresenter } from '../presenters/document-type-presenter'

@Controller('/')
export class ListDocumentTypeController {
  constructor(
    private listDocumentType: ListDocumentTypeUseCase,
  ) {}

  @Get()
  async handle() {
    const result = await this.listDocumentType.execute()

    if (result.isError()) {
      throw new BadRequestException()
    }

    const documentType = result.value.documentTypes

    return {
      documentTypes: documentType.map(
        DocumentTypePresenter.toHTTP,
      ),
    }
  }
}
