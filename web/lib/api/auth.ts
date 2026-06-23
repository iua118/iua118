import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const authApi = axios.create({
  baseURL: API_URL,
});

// Thêm token vào request
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Đăng ký
export async function register(data: RegisterPayload): Promise<AuthResponse> {
  const response = await authApi.post('/auth/register', data);
  return response.data;
}

// Đăng nhập
export async function login(data: LoginPayload): Promise<AuthResponse> {
  const response = await authApi.post('/auth/login', data);
  return response.data;
}

// Lấy thông tin user hiện tại
export async function getCurrentUser() {
  const response = await authApi.get('/auth/me');
  return response.data;
}

// Đăng xuất
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// Refresh token
export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await authApi.post('/auth/refresh', { token });
  return response.data;
}

export default authApi;
