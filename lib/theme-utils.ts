export type MonacoTheme = "light" | "vs-dark"

export function getMonacoTheme(): MonacoTheme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "vs-dark" : "light"
}
