// export interface AuthUser {
//     username: string;
//     role: 'user' | 'admin';
//   }
  
// const STORAGE_KEY = 'auth_user';
  
// export const login = (username: string, password: string): AuthUser | null => {
//   if (username === 'admin' && password === 'admin') {
//     const user: AuthUser = { username, role: 'admin' };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
//     return user;
//   }
  
//   if (username === 'user' && password === 'user') {
//     const user: AuthUser = { username, role: 'user' };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
//     return user;
//   }
  
//   return null;
// };
  
// export const logout = () => {
//   localStorage.removeItem(STORAGE_KEY);
// };
  
// export const getCurrentUser = (): AuthUser | null => {
//   const stored = localStorage.getItem(STORAGE_KEY);
//   return stored ? JSON.parse(stored) : null;
// };
  
// export const isAdmin = () => getCurrentUser()?.role === 'admin';


export interface AuthUser {
    id: number;
    email: string;
    nickname: string;
    avatarUrl?: string;
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
  
