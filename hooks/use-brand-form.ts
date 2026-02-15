"use client"

import { useState, useCallback, useEffect } from "react"
import type { BrandKit, BrandColors, SocialLink } from "@/lib/brands/brand-types"
import { DEFAULT_BRAND_KIT } from "@/lib/brands/brand-types"
import { saveBrandKit, loadBrandKit } from "@/lib/brands/brand-storage"

export function useBrandForm() {
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT)
  const [isSaved, setIsSaved] = useState(false)

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
      setIsSaved(false)
    },
    []
  )

  const updateColor = useCallback(
    (colorKey: keyof BrandColors, value: string) => {
      setBrandKit((prev) => ({
        ...prev,
        colors: { ...prev.colors, [colorKey]: value },
      }))
      setIsSaved(false)
    },
    []
  )

  const addSocial = useCallback(() => {
    setBrandKit((prev) => ({
      ...prev,
      socials: [...prev.socials, { platform: "", url: "" }],
    }))
    setIsSaved(false)
  }, [])

  const removeSocial = useCallback((index: number) => {
    setBrandKit((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }))
    setIsSaved(false)
  }, [])

  const updateSocial = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setBrandKit((prev) => ({
        ...prev,
        socials: prev.socials.map((social, i) =>
          i === index ? { ...social, [field]: value } : social
        ),
      }))
      setIsSaved(false)
    },
    []
  )

  const setLogo = useCallback(
    (type: "primaryLogo" | "iconLogo", dataUrl: string | null) => {
      setBrandKit((prev) => ({ ...prev, [type]: dataUrl }))
      setIsSaved(false)
    },
    []
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
