export interface ContactListReq {
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: "WHATSAPP" | "TELEGRAM";
}

export interface ContactListRes {
  id: string;
  campaignId: string;
  name: string;
  role: string;
  phone: string;
  type: "WHATSAPP" | "TELEGRAM";
}