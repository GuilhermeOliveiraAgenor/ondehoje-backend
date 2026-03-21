export const ROLES = ['ADMINISTRATOR'] as const

export const PERMISSIONS = [
  // User
  { action: 'create', entity: 'User' },
  { action: 'delete', entity: 'User' },
  { action: 'edit', entity: 'User' },
  { action: 'get', entity: 'User' },
  { action: 'fetch', entity: 'User' },

  // Address
  { action: 'create', entity: 'Address' },
  { action: 'delete', entity: 'Address' },
  { action: 'edit', entity: 'Address' },
  { action: 'get', entity: 'Address' },
  { action: 'fetch', entity: 'Address' },

  // DocumentType
  { action: 'create', entity: 'DocumentType' },
  { action: 'delete', entity: 'DocumentType' },
  { action: 'edit', entity: 'DocumentType' },
  { action: 'get', entity: 'DocumentType' },
  { action: 'fetch', entity: 'DocumentType' },

  // Company
  { action: 'create', entity: 'Company' },
  { action: 'delete', entity: 'Company' },
  { action: 'edit', entity: 'Company' },
  { action: 'get', entity: 'Company' },
  { action: 'fetch', entity: 'Company' },

  // Category
  { action: 'create', entity: 'Category' },
  { action: 'delete', entity: 'Category' },
  { action: 'edit', entity: 'Category' },
  { action: 'get', entity: 'Category' },
  { action: 'fetch', entity: 'Category' },

  // Event
  { action: 'create', entity: 'Event' },
  { action: 'delete', entity: 'Event' },
  { action: 'edit', entity: 'Event' },
  { action: 'get', entity: 'Event' },
  { action: 'fetch', entity: 'Event' },

  // Information
  { action: 'create', entity: 'Information' },
  { action: 'delete', entity: 'Information' },
  { action: 'edit', entity: 'Information' },
  { action: 'get', entity: 'Information' },
  { action: 'fetch', entity: 'Information' },

  // Subscription
  { action: 'create', entity: 'Subscription' },
  { action: 'delete', entity: 'Subscription' },
  { action: 'edit', entity: 'Subscription' },
  { action: 'get', entity: 'Subscription' },
  { action: 'fetch', entity: 'Subscription' },

  // SubscriptionHist
  { action: 'create', entity: 'SubscriptionHist' },
  { action: 'delete', entity: 'SubscriptionHist' },
  { action: 'edit', entity: 'SubscriptionHist' },
  { action: 'get', entity: 'SubscriptionHist' },
  { action: 'fetch', entity: 'SubscriptionHist' },

  // Favorite
  { action: 'create', entity: 'Favorite' },
  { action: 'delete', entity: 'Favorite' },
  { action: 'edit', entity: 'Favorite' },
  { action: 'get', entity: 'Favorite' },
  { action: 'fetch', entity: 'Favorite' },

  // Parameter
  { action: 'create', entity: 'Parameter' },
  { action: 'delete', entity: 'Parameter' },
  { action: 'edit', entity: 'Parameter' },
  { action: 'get', entity: 'Parameter' },
  { action: 'fetch', entity: 'Parameter' },

  // Advertisement
  { action: 'create', entity: 'Advertisement' },
  { action: 'delete', entity: 'Advertisement' },
  { action: 'edit', entity: 'Advertisement' },
  { action: 'get', entity: 'Advertisement' },
  { action: 'fetch', entity: 'Advertisement' },
  { action: 'evaluate', entity: 'Advertisement' },

  // AdvertisementAuthorization
  { action: 'create', entity: 'AdvertisementAuthorization' },
  { action: 'delete', entity: 'AdvertisementAuthorization' },
  { action: 'edit', entity: 'AdvertisementAuthorization' },
  { action: 'get', entity: 'AdvertisementAuthorization' },
  { action: 'fetch', entity: 'AdvertisementAuthorization' },
] as const
