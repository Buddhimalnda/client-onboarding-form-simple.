import { publicApiClient, backEndApiClient } from '../axios';
import {
  RegisterRequest,
  RegisterResponse,
  AuthenticationRequest,
  AuthenticationResponse,
  TokenRequest,
  FCMRequest,
  ForgetPasswordRequest,
  VerifyEmailRequest,
  User
} from '@/utils/types/auth';

export class AuthService {
  // Register user
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await publicApiClient().post('/auth/register', data);
    return response.data;
  }

  // Authenticate user
  static async authenticate(data: AuthenticationRequest): Promise<AuthenticationResponse> {
    const response = await publicApiClient().post('/auth/authenticate', data);
    return response.data;
  }

  // Logout user
  static async logout(token: string): Promise<boolean> {
    const response = await publicApiClient().post('/auth/logout', token);
    return response.data;
  }

  // Check token validity
  static async checkToken(token: string): Promise<User> {
    const response = await publicApiClient().post('/auth/check', { token });
    return response.data;
  }

  // Refresh token
  static async refreshToken(token: string): Promise<AuthenticationResponse> {
    const response = await publicApiClient().post('/auth/refresh', { token });
    return response.data;
  }

  // Save FCM token
  static async saveFCMToken(data: FCMRequest): Promise<string> {
    const response = await publicApiClient().post('/auth/fcm-token', data);
    return response.data;
  }

  // Forget password
  static async forgetPassword(data: ForgetPasswordRequest): Promise<string> {
    const response = await publicApiClient().post('/auth/forget-password', data);
    return response.data;
  }

  // Verify email
  static async verifyEmail(data: VerifyEmailRequest): Promise<AuthenticationResponse> {
    const response = await publicApiClient().post('/auth/verify-email', data);
    return response.data;
  }

  // Resend OTP email
  static async resendOTP(email: string): Promise<string> {
    const response = await publicApiClient().post('/auth/resend-otp', email);
    return response.data;
  }

  // Get user by UID
  static async getUserByUid(uid: string): Promise<AuthenticationResponse> {
    const response = await publicApiClient().post(`/auth/uid/${uid}`);
    return response.data;
  }
}