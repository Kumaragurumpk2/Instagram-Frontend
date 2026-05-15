import type {
  IUser,
  IAuthResponse,
  IRegisterRequest,
  ILoginRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
} from '../types';
import { USE_MOCK, TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/apiEndpoints';
import { MOCK_USERS } from '../mock/mockData';
import { authAxios } from './axiosConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  // ── REGISTER ──
  register: async (data: IRegisterRequest): Promise<IUser> => {
    if (USE_MOCK) {
      await delay(800);
      const exists = MOCK_USERS.find(
        (u) => u.username === data.username || u.email === data.email
      );
      if (exists) throw new Error('Username or email already exists');
      const newUser: IUser = {
        id: MOCK_USERS.length + 1,
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        profile_pic: data.profile_pic
          ? URL.createObjectURL(data.profile_pic)
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.profile_pic) formData.append('profile_pic', data.profile_pic);
    const res = await authAxios.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  // ── LOGIN ──
  login: async (data: ILoginRequest): Promise<IAuthResponse> => {
    if (USE_MOCK) {
      await delay(700);
      const user = MOCK_USERS.find(
        (u) =>
          u.username === data.username_or_email ||
          u.email === data.username_or_email
      );
      if (!user || data.password.length < 3) {
        throw new Error('Invalid credentials');
      }
      const mockResponse: IAuthResponse = {
        access_token: `mock_jwt_token_${user.id}_${Date.now()}`,
        refresh_token: `mock_refresh_token_${user.id}_${Date.now()}`,
        user,
        expires_in: 3600,
      };
      localStorage.setItem(TOKEN_KEY, mockResponse.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, mockResponse.refresh_token);
      return mockResponse;
    }
    const res = await authAxios.post(API_ENDPOINTS.AUTH.LOGIN, data);
    const authRes: IAuthResponse = res.data.data;
    localStorage.setItem(TOKEN_KEY, authRes.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authRes.refresh_token);
    return authRes;
  },

  // ── LOGOUT ──
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // ── FORGOT PASSWORD ──
  forgotPassword: async (data: IForgotPasswordRequest): Promise<void> => {
    if (USE_MOCK) {
      await delay(600);
      const user = MOCK_USERS.find((u) => u.email === data.email);
      if (!user) throw new Error('No account found with this email');
      return;
    }
    await authAxios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  // ── RESET PASSWORD ──
  resetPassword: async (data: IResetPasswordRequest): Promise<void> => {
    if (USE_MOCK) {
      await delay(600);
      if (data.token !== 'RESET_TOKEN_ABC') throw new Error('Invalid or expired token');
      return;
    }
    await authAxios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  // ── GET USER PROFILE ──
  getUserProfile: async (userId: number): Promise<IUser> => {
    if (USE_MOCK) {
      await delay(300);
      const user = MOCK_USERS.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      return user;
    }
    const res = await authAxios.get(API_ENDPOINTS.AUTH.PROFILE(userId));
    return res.data.data;
  },

  // ── UPDATE PROFILE ──
  updateProfile: async (userId: number, data: Partial<IUser>): Promise<IUser> => {
    if (USE_MOCK) {
      await delay(500);
      const idx = MOCK_USERS.findIndex((u) => u.id === userId);
      if (idx === -1) throw new Error('User not found');
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data, updated_at: new Date().toISOString() };
      return MOCK_USERS[idx];
    }
    const res = await authAxios.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE(userId), data);
    return res.data.data;
  },

  // ── SEARCH USERS ──
  searchUsers: async (query: string): Promise<IUser[]> => {
    if (USE_MOCK) {
      await delay(300);
      const q = query.toLowerCase();
      return MOCK_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.full_name.toLowerCase().includes(q)
      );
    }
    const res = await authAxios.get(API_ENDPOINTS.AUTH.SEARCH_USERS, {
      params: { q: query },
    });
    return res.data.data;
  },

  // ── GET ALL USERS ──
  getAllUsers: async (): Promise<IUser[]> => {
    if (USE_MOCK) {
      await delay(200);
      return MOCK_USERS;
    }
    const res = await authAxios.get(API_ENDPOINTS.AUTH.GET_ALL_USERS);
    return res.data.data;
  },

  // ── GET CURRENT USER FROM STORAGE ──
  getCurrentUser: (): IUser | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      // In real app: decode JWT. For mock, return first user
      if (USE_MOCK) return MOCK_USERS[0];
      return null;
    } catch {
      return null;
    }
  },
};
