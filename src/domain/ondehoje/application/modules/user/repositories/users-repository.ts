import { User } from '@/domain/ondehoje/enterprise/entities/user'
import { UserDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-details'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findDetailsById(id: string): Promise<UserDetails | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
}
