import api from '../lib/axios';

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'agent' | 'admin';
  phone?: string;
}

export const usersApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  
  updateMe: async (data: UserUpdate): Promise<User> => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  }
};
