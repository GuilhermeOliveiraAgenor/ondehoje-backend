import { Image } from '@/domain/ondehoje/enterprise/entities/image'

export class ImagePresenter {
  static toHTTP(raw: Image) {
    return {
      id: raw.id.toString(),
      url: `${process.env.AWS_BUCKET_PUBLIC_URL}/${raw.url}`,
      alt: raw.alt,
    }
  }
}
