import { WatchedList } from '@/core/entities/watched-list'

import { UserImage } from './user-image'

export class UserImageList extends WatchedList<UserImage> {
  compareItems(a: UserImage, b: UserImage): boolean {
    return a.userId.equals(b.userId) && a.imageId.equals(b.imageId)
  }
}
