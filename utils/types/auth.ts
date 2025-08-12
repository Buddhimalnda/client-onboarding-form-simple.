export interface UserModel {
  id: string
  email: string
  name: string
}

export interface UserBranch {
  id: string
  name: string
  location: string
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  nic: string;
  phone: string;
  address: string;
  uid?: string;
  fcmToken?: string;
  username: string;
  branch?: string;
  recaptchaToken?: string;
  loginType: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  emailSent: boolean;
  status: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  token?: string; // For backward compatibility
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nic: string;
  uid?: string;
  phone?: string;
  fcmToken?: string;
  address?: string;
  branch?: string;
  createAt: string;
  createBy?: string;
  updateAt?: string;
  role: Role;
  status: string;
  loginType?: LoginType;
  otp: string;
  isEmailVerified: boolean;
  otpGeneratedAt?: string;
}

export interface TokenRequest {
  token: string;
}

export interface FCMRequest {
  token: string;
  fcmToken: string;
  device: string;
}

export interface ForgetPasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum LoginType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp when token expires
  issuedAt: number; // timestamp when token was issued
}