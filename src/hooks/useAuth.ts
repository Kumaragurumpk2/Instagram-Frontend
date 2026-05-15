import { useAppSelector, useAppDispatch } from '../store';
import { loginSuccess, loginFailure, logout, updateUser, clearError } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import type { ILoginRequest, IRegisterRequest, IUser } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error, loginAttempts, blockedUntil } =
    useAppSelector((state) => state.auth);

  const login = async (data: ILoginRequest): Promise<void> => {
    const res = await authService.login(data);
    dispatch(loginSuccess({ user: res.user, token: res.access_token }));
  };

  const register = async (data: IRegisterRequest): Promise<IUser> => {
    return await authService.register(data);
  };

  const logoutUser = (): void => {
    authService.logout();
    dispatch(logout());
  };

  const updateProfile = async (userId: number, data: Partial<IUser>): Promise<void> => {
    const updated = await authService.updateProfile(userId, data);
    dispatch(updateUser(updated));
  };

  const clearAuthError = (): void => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginAttempts,
    blockedUntil,
    login,
    register,
    logout: logoutUser,
    updateProfile,
    clearAuthError,
  };
};
