import { UserRole } from './enums';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}
