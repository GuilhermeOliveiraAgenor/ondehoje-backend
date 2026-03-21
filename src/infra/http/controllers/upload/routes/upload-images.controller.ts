import {
  BadRequestException,
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

import { InvalidImageTypeError } from '@/domain/ondehoje/application/modules/image/errors/invalid-image-type-error'
import { UploadAndCreateManyImagesUseCase } from '@/domain/ondehoje/application/modules/image/use-case/upload-and-create-many-images'

@Controller('/images')
export class UploadImagesController {
  constructor(
    private uploadAndCreateManyImages: UploadAndCreateManyImagesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 15))
  async handle(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const result = await this.uploadAndCreateManyImages.execute({
      images: files.map((file) => ({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      })),
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidImageTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { images } = result.value

    return {
      imagesIds: images.map((image) => image.id.toString()),
    }
  }
}
