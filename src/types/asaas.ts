// Tipos para a API do Asaas

export type BillingType = 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
export type ChargeType = 'DETACHED' | 'RECURRENT' | 'INSTALLMENT';

export interface Callback {
  successUrl: string;
  autoRedirect?: boolean;
}

export interface PaymentLinkData {
  billingType: BillingType;
  chargeType: ChargeType;
  value: number;
  name: string;
  description: string;
  externalReference?: string;
  callback?: Callback;
  dueDateLimitDays?: number;
  subscriptionCycle?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  maxInstallmentCount?: number;
  notificationEnabled?: boolean;
  isAddressRequired?: boolean;
}

export interface PaymentLinkResponse {
  id: string;
  name: string;
  value: number;
  active: boolean;
  chargeType: string;
  url: string;
  billingType: string;
  subscriptionCycle?: string;
  description: string;
  endDate?: string;
  deleted: boolean;
  viewCount: number;
  maxInstallmentCount: number;
  dueDateLimitDays: number;
  notificationEnabled: boolean;
  isAddressRequired: boolean;
  externalReference: string;
}

// Tipos para os webhooks do Asaas
export type WebhookEventType = 
  | 'PAYMENT_CREATED'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_OVERDUE'
  | 'PAYMENT_DELETED';

export interface WebhookEvent {
  event: WebhookEventType;
  payment: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    billingType: BillingType;
    status: string;
    dueDate: string;
    originalDueDate: string;
    paymentDate: string;
    clientPaymentDate: string;
    invoiceUrl: string;
    invoiceNumber: string;
    externalReference: string;
    deleted: boolean;
    anticipated: boolean;
    creditCard?: {
      creditCardNumber: string;
      creditCardBrand: string;
      creditCardToken: string;
    };
  };
}
