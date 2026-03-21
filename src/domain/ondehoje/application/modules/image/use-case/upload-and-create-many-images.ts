import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'

import { Uploader } from '../../../storage/uploader'
import { InvalidImageTypeError } from '../errors/invalid-image-type-error'
import { ImagesRepository } from '../repositories/images-repository'

interface UploadAndCreateManyImagesUseCaseRequest {
  images: Array<{
    fileName: string
    fileType: string
    body: Buffer
  }>
}

type UploadAndCreateManyImagesUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    images: Image[]
  }
>

@Injectable()
export class UploadAndCreateManyImagesUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    images,
  }: UploadAndCreateManyImagesUseCaseRequest): Promise<UploadAndCreateManyImagesUseCaseResponse> {
    const imagesToUpload: Image[] = []

    for (const data of images) {
      if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(data.fileType)) {
        return failure(new InvalidImageTypeError(data.fileType))
      }

      const { url } = await this.uploader.upload({
        fileName: data.fileName,
        fileType: data.fileType,
        body: data.body,
      })

      const image = Image.create({
        url,
        alt: data.fileName,
      })

      imagesToUpload.push(image)
    }

    await this.imagesRepository.createMany(imagesToUpload)

    return success({
      images: imagesToUpload,
    })
  }
}
