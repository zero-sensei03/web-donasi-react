import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authLogin, authLogout } from "./http";
import type { AuthRes, SignInReq } from "@/interfaces/auth.interface";
import type { BaseResponse } from "@/interfaces/base.interface";

export const useAuthSignIn = () => {
  return useMutation<BaseResponse<AuthRes>, AxiosError<BaseResponse>, SignInReq>({
    mutationFn: (formData) => authLogin(formData),
    onSuccess: () => {},
    onError: (error) => {
      throw error;
    },
  });
};


export const useAuthLogout = () => {
  return useMutation<BaseResponse<boolean>, AxiosError<BaseResponse>, null>({
    mutationFn: () => authLogout(),
    onSuccess: () => {},
    onError: (error) => {
      throw error;
    },
  });
};
