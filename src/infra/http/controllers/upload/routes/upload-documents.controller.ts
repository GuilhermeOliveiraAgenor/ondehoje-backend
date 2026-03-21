import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import z from 'zod'

import type { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { InvalidDocumentTypeError } from '@/domain/ondehoje/application/modules/document/errors/invalid-document-type-error'
import { UploadAndCreateManyDocumentsUseCase } from '@/domain/ondehoje/application/modules/document/use-cases/upload-and-create-many-documents'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const uploadDocumentBodySchema = z.object({
  documents: z
    .string()
    .transform((val, ctx) => {
      try {
        const parsed = JSON.parse(val)
        return parsed
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O campo 'documents' deve ser um JSON válido.",
        })
        return z.NEVER
      }
    })
    .pipe(
      z.array(
        z.object({
          documentTypeId: z.string(),
          name: z.string(),
          description: z.string().optional(),
          expiresAt: z.string().nullable().optional(),
        }),
      ),
    ),
})

const bodyValidationPipe = new ZodValidationPipe(uploadDocumentBodySchema)

type UploadDocumentBodySchema = z.infer<typeof uploadDocumentBodySchema>

@Controller('/documents')
export class UploadDocumentsController {
  constructor(
    private uploadAndCreateManyDocuments: UploadAndCreateManyDocumentsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 15))
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Body(bodyValidationPipe) body: UploadDocumentBodySchema,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const { documents } = body

    if (documents.length !== files.length) {
      throw new BadRequestException(
        'A quantidade de documentos deve corresponder à quantidade de arquivos enviados.',
      )
    }

    const mappedDocuments = documents.map((doc, index) => {
      const file = files[index]

      return {
        documentTypeId: doc.documentTypeId,
        name: doc.name,
        description: doc.description,
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : null,
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      }
    })

    const result = await this.uploadAndCreateManyDocuments.execute({
      documents: mappedDocuments,
      requestedBy: user.id,
    })

    if (result.isError()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidDocumentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { documentsIds } = result.value

    return {
      documentsIds,
    }
  }
}
