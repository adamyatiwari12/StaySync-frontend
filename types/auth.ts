export interface SignupData {
  username: string;
  email: string;
  password: string;
  stayId: string;   // ✅ REQUIRED
}

export interface LoginData {
  email: string;
  password: string;
  stayId: string;   // ✅ REQUIRED
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "tenant";
  stayId: string;   // ✅ REQUIRED
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
