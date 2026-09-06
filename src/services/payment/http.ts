import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  CreatePaymentMethodPayload,
  PaymentMethod,
  PaymentMethodListResponse,
  PaymentRes,
} from '@/interfaces/payment.interface';

export const getPaymentPublic = async (
  campaignId: string
): Promise<BaseResponse<PaymentRes[]>> => {
  const response = await api.get(
    `/public/payment-method/campaign/${campaignId}`
  );
  return response.data;
};

const PAYMENT_METHOD_ENDPOINT = '/protected/payment-method';

export interface GetPaymentMethodsParams {
  campaignId: string;
  page: number;
  limit: number;
  search?: string;
  type?: string;
}

export const getPaymentMethods = async (
  params: GetPaymentMethodsParams
): Promise<PaymentMethodListResponse> => {
  const response = await api.get(
    `${PAYMENT_METHOD_ENDPOINT}/campaign/${params.campaignId}`,
    {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}),
        ...(params.type ? { type: params.type } : {}),
      },
    }
  );

  return response.data.data;
};

export const createPaymentMethod = async (
  payload: CreatePaymentMethodPayload
): Promise<PaymentMethod> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('name', payload.name);
  formData.append('type', payload.type);

  if (payload.description) {
    formData.append('description', payload.description);
  }

  if (payload.bankName) {
    formData.append('bankName', payload.bankName);
  }

  if (payload.accountNumber) {
    formData.append('accountNumber', payload.accountNumber);
  }

  if (payload.qris) {
    formData.append('qris', payload.qris);
  }

  const response = await api.post(PAYMENT_METHOD_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const updatePaymentMethod = async (
  id: string,
  payload: CreatePaymentMethodPayload
): Promise<PaymentMethod> => {
  const formData = new FormData();

  formData.append('campaignId', payload.campaignId);
  formData.append('name', payload.name);
  formData.append('type', payload.type);

  if (payload.description) {
    formData.append('description', payload.description);
  }

  if (payload.bankName) {
    formData.append('bankName', payload.bankName);
  }

  if (payload.accountNumber) {
    formData.append('accountNumber', payload.accountNumber);
  }

  if (payload.qris) {
    formData.append('qris', payload.qris);
  }

  const response = await api.put(`${PAYMENT_METHOD_ENDPOINT}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await api.delete(`${PAYMENT_METHOD_ENDPOINT}/${id}`);
};
