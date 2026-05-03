import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", ":root"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--color-brand-50)", 100: "var(--color-brand-100)", 200: "var(--color-brand-200)", 300: "var(--color-brand-300)", 400: "var(--color-brand-400)", 500: "var(--color-brand-500)", 600: "var(--color-brand-600)", 700: "var(--color-brand-700)", 800: "var(--color-brand-800)", 900: "var(--color-brand-900)"
        },
        neutral: {
          50: "var(--color-neutral-50)", 100: "var(--color-neutral-100)", 200: "var(--color-neutral-200)", 300: "var(--color-neutral-300)", 400: "var(--color-neutral-400)", 500: "var(--color-neutral-500)", 600: "var(--color-neutral-600)", 700: "var(--color-neutral-700)", 800: "var(--color-neutral-800)", 900: "var(--color-neutral-900)"
        }
      },
      spacing: { 1: "var(--space-1)", 2: "var(--space-2)", 3: "var(--space-3)", 4: "var(--space-4)", 6: "var(--space-6)", 8: "var(--space-8)" },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
      boxShadow: { card: "var(--shadow-card)", modal: "var(--shadow-modal)" },
      transitionDuration: { fast: "var(--motion-fast)", normal: "var(--motion-normal)" },
      transitionTimingFunction: { expressive: "var(--motion-ease)" }
    }
  }
} satisfies Config;
