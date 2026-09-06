export interface SignInReq {
  email: string;
  password: string;
}

export interface AuthRes {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    role: string;
  };
}
