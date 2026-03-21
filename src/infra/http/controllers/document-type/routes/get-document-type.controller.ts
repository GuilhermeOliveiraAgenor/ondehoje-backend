import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/get-document-type'

import { DocumentTypePresenter } from '../presenters/document-type-presenter'

@Controller('/:id')
export class GetDocumentTypeController {
  constructor(private documentType: GetDocumentTypeUseCase) {}

  @Get()
  async handle(@Param('id') documentTypeId: string) {
    const result = await this.documentType.execute({
      documentTypeId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    return {
      documentType: DocumentTypePresenter.toHTTP(result.value.documentType),
    }
  }
}
