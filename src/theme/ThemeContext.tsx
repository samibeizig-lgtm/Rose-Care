import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DARK_TH = {
  bg: '#0D0D1A',
  card: '#161625',
  surface: '#1C1C2E',
  border: 'rgba(255,255,255,0.09)',
  text: '#EEEEFF',
  textSub: 'rgba(238,238,255,0.62)',
  textMuted: 'rgba(238,238,255,0.35)',
  infoBox: '#1E1838',
  inputBg: '#1C1C2E',
  lilac: '#1E1838',
  sectionLabel: 'rgba(238,238,255,0.38)',
  checklistBg: '#161625',
  warningLight: '#2A1F00',
};

export const LIGHT_TH = {
  bg: '#FFFFFF',
  card: '#FAFAFA',
  surface: '#FAFAFA',
  border: '#EDE9F6',
  text: '#1E1B4B',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  infoBox: '#F5F0FF',
  inputBg: '#FAFAFA',
  lilac: '#F5F0FF',
  sectionLabel: '#9CA3AF',
  checklistBg: '#FAFAFA',
  warningLight: '#FFFBEB',
};

export type ThemeColors = typeof LIGHT_TH;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  th: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  th: LIGHT_TH,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('rose_care_theme').then((val) => {
      if (val === 'dark') setIsDark(true);
    }).catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem('rose_care_theme', next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  };

  const th = isDark ? DARK_TH : LIGHT_TH;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, th }}>
      {children}
    </ThemeContext.Provider>
  );
}
