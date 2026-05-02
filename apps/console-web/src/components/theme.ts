export interface ColorScale {
  50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string;
}

export interface ConsoleTheme {
  name: string;
  mode: "dark" | "light";
  brand: ColorScale;
  neutral: ColorScale;
  accent: ColorScale;
  radius: { sm: number; md: number; lg: number; xl: number };
  elevation: { card: string; modal: string };
  spacing: number[];
  typography: { fontFamily: string; titleWeight: number; bodyWeight: number };
}

export const cloudShieldDarkTheme: ConsoleTheme = {
  name: "cloud-shield-dark",
  mode: "dark",
  brand: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12" },
  neutral: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a" },
  accent: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63" },
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
  elevation: { card: "0 8px 24px rgba(15,23,42,0.35)", modal: "0 18px 48px rgba(2,6,23,0.55)" },
  spacing: [0, 4, 8, 12, 16, 24, 32, 40, 48],
  typography: { fontFamily: "Inter, ui-sans-serif, system-ui", titleWeight: 700, bodyWeight: 500 }
};
