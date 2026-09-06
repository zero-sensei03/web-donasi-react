export interface ContactListReq {
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: 'WHATSAPP' | 'TELEGRAM';
}

export interface ContactListRes {
  id: string;
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: 'WHATSAPP' | 'TELEGRAM';
}

export type ContactType = 'WHATSAPP' | 'TELEGRAM';

export interface ContactList {
  id: string;
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: ContactType;
  createdAt: string;
  updatedAt: string;
}

export interface ContactListResponse {
  items: ContactList[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateContactPayload {
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: ContactType;
}
