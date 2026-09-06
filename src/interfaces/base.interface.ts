export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}
