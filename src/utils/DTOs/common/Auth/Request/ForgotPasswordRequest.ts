export interface ForgotPasswordRequest {
  username: string;
  otp: string;
  newPassword: string;
}
