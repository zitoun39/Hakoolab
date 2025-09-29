// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

type Spacing = { xs: number; sm: number; md: number; lg: number; xl: number };
type Radius = { sm: number; md: number; lg: number; xl: number };
type Elevation = { sm: number; md: number; lg: number };
type Shadow = {
  // قيم ظل متوافقة مع web/iOS (Android يعتمد elevation غالبًا)
  sm: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width: number; height: number } };
  md: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width: number; height: number } };
  lg: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width: number; height: number } };
};

type Theme = {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  spacing: Spacing;
  radius: Radius;
  elevation: Elevation; // Android
  shadows: Shadow;      // Web/iOS
};

const spacing: Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const radius: Radius = { sm: 6, md: 12, lg: 16, xl: 24 };
const elevation: Elevation = { sm: 2, md: 5, lg: 10 };

// ظلال خفيفة/متوسطة/قوية
const lightShadows: Shadow = {
  sm: { shadowColor: "#000000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  md: { shadowColor: "#000000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  lg: { shadowColor: "#000000", shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
};
const darkShadows: Shadow = {
  // في الثيم الداكن نخفف الشفافية شوية
  sm: { shadowColor: "#000000", shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  md: { shadowColor: "#000000", shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  lg: { shadowColor: "#000000", shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
};

const light: Theme = {
  colors: {
    primary: "#2563eb",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
  },
  spacing,
  radius,
  elevation,
  shadows: lightShadows,
};

const dark: Theme = {
  colors: {
    primary: "#2563eb",
    background: "#0b1220",
    surface: "#0f172a",
    text: "#e2e8f0",
    textSecondary: "#94a3b8",
    border: "#1f2937",
  },
  spacing,
  radius,
  elevation,
  shadows: darkShadows,
};

type Ctx = {
  theme: Theme;
  mode: "light" | "dark";
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const value = useMemo<Ctx>(
    () => ({
      theme: mode === "light" ? light : dark,
      mode,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
