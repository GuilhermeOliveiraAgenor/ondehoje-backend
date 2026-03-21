import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Document } from '@/domain/ondehoje/enterprise/entities/document'

export function makeDocument(
  override: Partial<Document> = {},
  id?: UniqueEntityID,
) {
  const document = Document.create(
    {
      name: faker.word.words(3),
      file: faker.image.url(),
      documentTypeId: new UniqueEntityID(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return document
}
