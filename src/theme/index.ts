import { Appearance } from 'react-native';

export type Theme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    warningText: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; lineHeight: number };
    caption: { fontSize: number; lineHeight: number };
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
};

const lightTheme: Theme = {
  colors: {
    primary: '#1e40af',
    secondary: '#0891b2',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#16a34a',
    warning: '#f59e0b',
    warningText: '#92400e',
    error: '#dc2626',
    info: '#0891b2',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
    h2: { fontSize: 20, fontWeight: 'bold', lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 16, lineHeight: 22 },
    caption: { fontSize: 14, lineHeight: 20 },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#3b82f6',
    secondary: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#475569',
    success: '#22c55e',
    warning: '#fbbf24',
    warningText: '#fbbf24',
    error: '#ef4444',
    info: '#06b6d4',
  },
};

export const getTheme = (): Theme => {
  return Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
};

export { lightTheme, darkTheme };