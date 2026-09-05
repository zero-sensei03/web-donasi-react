export interface PaymentRes {
    id: string;
    type: "QRIS" | "BANK_TRANSFER";
    qrisImage: string | null;
    bankName: string | null;
    accountNumber: string | null;
    name: string;
    description: string | null;
}