import { resolveTheme, type ThemePreference } from "./theme";

export function applyThemePreference(preference: ThemePreference, root: HTMLElement = document.documentElement): void {
  const next = resolveTheme(preference);
  root.classList.toggle("light", next.mode === "light");
  root.classList.toggle("dark", next.mode === "dark");
  root.dataset.theme = next.name;
}
