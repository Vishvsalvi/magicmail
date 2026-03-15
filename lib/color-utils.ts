export const HEX_COLOR_PATTERN = /^#?[0-9a-fA-F]{6}$/

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  if (!HEX_COLOR_PATTERN.test(trimmed)) return null
  return `#${trimmed.replace("#", "").toLowerCase()}`
}
