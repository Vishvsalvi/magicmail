export type SocialLink = {
  platform: string
  url: string
}

export type BrandColors = {
  background: string
  container: string
  accent: string
  buttonText: string
}

export type BrandKit = {
  kitName: string
  website: string
  brandSummary: string
  address: string
  toneOfVoice: string
  copyright: string
  footer: string
  disclaimers: string
  socials: SocialLink[]
  primaryLogo: string | null
  iconLogo: string | null
  colors: BrandColors
}

export const DEFAULT_BRAND_KIT: BrandKit = {
  kitName: "New Brand Kit #1",
  website: "",
  brandSummary: "",
  address: "",
  toneOfVoice: "neutral",
  copyright: `© ${new Date().getFullYear()}`,
  footer: "",
  disclaimers: "",
  socials: [],
  primaryLogo: null,
  iconLogo: null,
  colors: {
    background: "#f4f4f5",
    container: "#ffffff",
    accent: "#18181b",
    buttonText: "#ffffff",
  },
}
