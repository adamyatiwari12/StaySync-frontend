import API from "@/lib/axios";
import { SignupData, LoginData, AuthResponse } from "@/types/auth";
import { AxiosResponse } from "axios";

export const signup = (data: SignupData): Promise<AxiosResponse<AuthResponse>> => {
  return API.post("/auth/signup", data);
};

export const signin = (data: LoginData): Promise<AxiosResponse<AuthResponse>> => {
  return API.post("/auth/signin", data);
};
