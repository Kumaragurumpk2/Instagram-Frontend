import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../types';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constants/apiEndpoints';
import { authService } from '../../services/authService';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  blockedUntil: string | null;
}

const initialState: AuthState = {
  user: authService.getCurrentUser(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isLoading: false,
  error: null,
  loginAttempts: 0,
  blockedUntil: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    loginSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.loginAttempts = 0;
      state.blockedUntil = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loginAttempts += 1;
      if (state.loginAttempts >= 5) {
        const blockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        state.blockedUntil = blockedUntil;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loginAttempts = 0;
      state.blockedUntil = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError(state) {
      state.error = null;
    },
    resetLoginAttempts(state) {
      state.loginAttempts = 0;
      state.blockedUntil = null;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  resetLoginAttempts,
} = authSlice.actions;

export default authSlice.reducer;
