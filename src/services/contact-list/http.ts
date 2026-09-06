import api from '@/lib/axios';
import type { BaseResponse } from '@/interfaces/base.interface';
import type {
  ContactList,
  ContactListRes,
  ContactListResponse,
  CreateContactPayload,
} from '@/interfaces/contact-list.interface';

export const getContactListPublic = async (
  campaignId: string
): Promise<BaseResponse<ContactListRes[]>> => {
  const response = await api.get(`/public/contact-list/campaign/${campaignId}`);
  return response.data;
};

const CONTACT_ENDPOINT = '/protected/contact-list';

export interface GetContactsParams {
  campaignId: string;
  page: number;
  limit: number;
  search?: string;
  type?: string;
}

export const getContactList = async (
  params: GetContactsParams
): Promise<ContactListResponse> => {
  const response = await api.get(
    `${CONTACT_ENDPOINT}/campaign/${params.campaignId}`,
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

export const createContact = async (
  payload: CreateContactPayload
): Promise<ContactList> => {
  const response = await api.post(CONTACT_ENDPOINT, payload);

  return response.data.data;
};

export const updateContact = async (
  id: string,
  payload: CreateContactPayload
): Promise<ContactList> => {
  const response = await api.put(`${CONTACT_ENDPOINT}/${id}`, payload);

  return response.data.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`${CONTACT_ENDPOINT}/${id}`);
};
