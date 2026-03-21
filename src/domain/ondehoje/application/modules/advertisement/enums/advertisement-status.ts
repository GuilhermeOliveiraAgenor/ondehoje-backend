enum AdvertisementStatus {
  WAITING_AUTHORIZATION = 'waiting_authorization', // Aguardando autorização do administrador
  WAITING_PAYMENT = 'waiting_payment', // Aguardando pagamento
  ACTIVE = 'active', // Anúncio ativo e válida
  NOT_AUTHORIZED = 'not_authorized', // Não autorizada pelo administrador
  CANCELED = 'canceled', // Cancelada
  EXPIRED = 'expired', // Expirada
}

export { AdvertisementStatus }
