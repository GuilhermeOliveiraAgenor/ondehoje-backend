enum SubscriptionStatus {
  ACTIVE = 'active', // Assinatura ativa e válida
  INACTIVE = 'inactive', // Criada mas ainda não ativada
  PENDING = 'pending', // Aguardando confirmação/pagamento
  TRIAL = 'trial', // Em período de teste
  CANCELED = 'canceled', // Cancelada pelo usuário ou admin
  EXPIRED = 'expired', // Expirada por não renovação
  SUSPENDED = 'suspended', // Suspensa (ex: problema no pagamento)
  PAST_DUE = 'past_due', // Pagamento atrasado
}

export { SubscriptionStatus }
