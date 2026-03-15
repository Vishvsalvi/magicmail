"use client"

import { useState, useCallback, useEffect } from "react"
import type { BrandKit, BrandColors, SocialLink } from "@/lib/brands/brand-types"
import { DEFAULT_BRAND_KIT } from "@/lib/brands/brand-types"
import { saveBrandKit, loadBrandKit } from "@/lib/brands/brand-storage"

export function useBrandForm() {
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT)
  const [isSaved, setIsSaved] = useState(false)

  const markDirty = useCallback(() => setIsSaved(false), [])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadBrandKit()
    if (stored) {
      setBrandKit(stored)
    }
  }, [])

  const updateField = useCallback(
    <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => {
      setBrandKit((prev) => ({ ...prev, [field]: value }))
      markDirty()
    },
    [markDirty]
  )

  const updateColor = useCallback(
    (colorKey: keyof BrandColors, value: string) => {
      setBrandKit((prev) => ({
        ...prev,
        colors: { ...prev.colors, [colorKey]: value },
      }))
      markDirty()
    },
    [markDirty]
  )

  const addSocial = useCallback(() => {
    setBrandKit((prev) => ({
      ...prev,
      socials: [...prev.socials, { platform: "", url: "" }],
    }))
    markDirty()
  }, [markDirty])

  const removeSocial = useCallback((index: number) => {
    setBrandKit((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }))
    markDirty()
  }, [markDirty])

  const updateSocial = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setBrandKit((prev) => ({
        ...prev,
        socials: prev.socials.map((social, i) =>
          i === index ? { ...social, [field]: value } : social
        ),
      }))
      markDirty()
    },
    [markDirty]
  )

  const setLogo = useCallback(
    (type: "primaryLogo" | "iconLogo", dataUrl: string | null) => {
      setBrandKit((prev) => ({ ...prev, [type]: dataUrl }))
      markDirty()
    },
    [markDirty]
  )

  const saveBrand = useCallback(() => {
    saveBrandKit(brandKit)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }, [brandKit])

  return {
    brandKit,
    isSaved,
    updateField,
    updateColor,
    addSocial,
    removeSocial,
    updateSocial,
    setLogo,
    saveBrand,
  }
}
