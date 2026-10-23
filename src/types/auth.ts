export interface UserProfile {
  uid: string;
  id?: string;
  email: string;
  companyName?: string;
  role?: string;
  interest?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isLoggedIn: boolean;
}
