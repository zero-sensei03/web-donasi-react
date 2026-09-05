import refreshApi from "@/lib/axios-refresh";
import api from "@/lib/axios";
import type { AuthRes, SignInReq } from "@/interfaces/auth.interface";
import type { BaseResponse } from "@/interfaces/base.interface";

export const authLogin = async (data: SignInReq): Promise<BaseResponse<AuthRes>> => {
  const response = await api.post(`/auth/sign-in`, data);
  return response.data;
};
export const authRefreshToken = async ( refreshToken: string ): Promise<BaseResponse<AuthRes>> => {
  const response = await refreshApi.post(`/auth/refresh`, { refreshToken });
  return response.data;
};
export const authLogout = async (): Promise<BaseResponse<boolean>> => {
  const response = await api.delete(`/auth/logout`);
  return response.data;
};
