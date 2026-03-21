import { Image } from '@/domain/ondehoje/enterprise/entities/image'

export abstract class ImagesRepository {
  abstract createMany(images: Image[]): Promise<void>
}
