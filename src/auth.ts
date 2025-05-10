// src/auth.ts

export interface AuthUser {
    id: number;
    email: string;
    nickname: string;
    avatarUrl?: string;
    roleId: number;
  }
  
const STORAGE_KEY = 'auth_user';
  
export const saveCurrentUser = (user: AuthUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};
  
export const getCurrentUser = (): AuthUser | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};
  
export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};
  
