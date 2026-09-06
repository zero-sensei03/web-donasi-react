export interface PaymentRes {
  id: string;
  type: 'QRIS' | 'BANK_TRANSFER';
  qrisImage: string | null;
  bankName: string | null;
  accountNumber: string | null;
  name: string;
  description: string | null;
}

export type PaymentMethodType = 'QRIS' | 'BANK_TRANSFER';

export interface PaymentMethod {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  bankName: string | null;
  accountNumber: string | null;
  type: PaymentMethodType;
  qrisImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodListResponse {
  items: PaymentMethod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePaymentMethodPayload {
  campaignId: string;
  name: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  type: PaymentMethodType;
  qris?: File | null;
}
