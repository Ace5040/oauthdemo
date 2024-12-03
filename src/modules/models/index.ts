export interface ServerResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

export interface OAuthToken {
  idToken: string;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
  refreshToken: string;
}

export interface BlitzUserProfile {
  id: string,
  email: string,
  lastName: string,
  firstName: string,
  phone: string,
  middleName?: string,
}