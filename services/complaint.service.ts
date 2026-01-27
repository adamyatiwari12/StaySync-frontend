import API from "@/lib/axios";
import { Complaint, CreateComplaintData } from "@/types/complaint";
import { AxiosResponse } from "axios";

export const getComplaints = (): Promise<AxiosResponse<Complaint[]>> => {
    return API.get("/complaints")
}

export const updateComplaintStatus = (id: string, status: Complaint["status"]) => {
    return API.put(`/complaints/${id}/status`, { status });
}

export const createComplaint = (data: CreateComplaintData) => {
    return API.post("/complaints", data);
}
   
export const getMyComplaints = (): Promise<AxiosResponse<Complaint[]>> => {
    return API.get("/complaints/my")
}
    