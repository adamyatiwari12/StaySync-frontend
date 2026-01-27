import API from "@/lib/axios";
import { AxiosResponse } from "axios";
import { Payment, CreatePaymentData } from "@/types/payment";

export const getPayments = (): Promise<AxiosResponse<Payment[]>> => {
    return API.get("/payments");
};

export const markPaymentAsPaid = (id: string) => {
    return API.patch(`/payments/${id}/pay`);
};

export const getMyPayments = (): Promise<AxiosResponse<Payment[]>> => {
    return API.get("/payments/me");
};

export const createPayment = (data: CreatePaymentData): Promise<AxiosResponse<Payment>> => {
    return API.post("/payments", data);
};

export const deletePayment = (id: string) => {
    return API.delete(`/payments/${id}`);
};
