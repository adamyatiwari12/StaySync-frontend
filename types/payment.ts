export type PaymentStatus = "pending" | "paid";

export interface Payment {
  _id: string;
  amount: number;
  month: number;
  year: number;
  status: PaymentStatus;
  paidAt?: string;

  tenantId: {
    _id: string;
    username: string;
    email: string;
  };

  roomId: {
    _id: string;
    roomNumber: string;
  };
}

export interface CreatePaymentData {
  tenantId: string;
  roomId: string;
  amount: number;
  month: number;
  year: number;
}