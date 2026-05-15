import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { INotification, ThemeMode } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../mock/mockData';

interface UIState {
  theme: ThemeMode;
  notifications: INotification[];
  unreadCount: number;
  isCreatePostOpen: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null;
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as ThemeMode) || 'dark',
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length,
  isCreatePostOpen: false,
  toastMessage: null,
  toastType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    markNotificationRead(state, action: PayloadAction<number>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.is_read) {
        notif.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.is_read = true));
      state.unreadCount = 0;
    },
    addNotification(state, action: PayloadAction<INotification>) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    setCreatePostOpen(state, action: PayloadAction<boolean>) {
      state.isCreatePostOpen = action.payload;
    },
    showToast(
      state,
      action: PayloadAction<{ message: string; type: UIState['toastType'] }>
    ) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast(state) {
      state.toastMessage = null;
      state.toastType = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  markNotificationRead,
  markAllRead,
  addNotification,
  setCreatePostOpen,
  showToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;
