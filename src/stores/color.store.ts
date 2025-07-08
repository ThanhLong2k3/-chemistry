import { create } from 'zustand';
import { ThemeConfig } from 'antd/lib/config-provider';
import { themeBlueConfig } from '@/constants/theme';

interface ColorState {
  themeColor: ThemeConfig;
  setThemeColor: (themeColor: ThemeConfig) => void;
}

export const useColorState = create<ColorState>()((set) => ({
  themeColor: themeBlueConfig,
  setThemeColor: (themeColor) => set({ themeColor }),
}));
