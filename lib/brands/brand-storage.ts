import { DEFAULT_BRAND_KIT, type BrandKit } from "./brand-types"

const STORAGE_KEY = "magicmail-brand-kit"

export function saveBrandKit(brandKit: BrandKit): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brandKit))
  } catch (error) {
    console.error("Failed to save brand kit:", error)
  }
}

export function loadBrandKit(): BrandKit | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data) as Partial<BrandKit>

    return {
      ...DEFAULT_BRAND_KIT,
      ...parsed,
      socials: Array.isArray(parsed.socials)
        ? parsed.socials
        : DEFAULT_BRAND_KIT.socials,
      colors: {
        ...DEFAULT_BRAND_KIT.colors,
        ...(parsed.colors ?? {}),
      },
    }
  } catch (error) {
    console.error("Failed to load brand kit:", error)
    return null
  }
}

export function clearBrandKit(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear brand kit:", error)
  }
}
