"use client"

import { useEffect, useRef, useCallback } from "react"
import type { BrandKit, BrandColors, SocialLink } from "@/lib/brands/brand-types"
import type { SectionId } from "./section-sidebar"
import { BrandDetailsSection } from "./sections/brand-details-section"
import { LegalSection } from "./sections/legal-section"
import { SocialsSection } from "./sections/socials-section"
import { LogosSection } from "./sections/logos-section"
import { ColorsSection } from "./sections/colors-section"
import { Separator } from "@/components/ui/separator"

type BrandFormProps = {
  brandKit: BrandKit
  onFieldChange: <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => void
  onColorChange: (key: keyof BrandColors, value: string) => void
  onAddSocial: () => void
  onRemoveSocial: (index: number) => void
  onUpdateSocial: (index: number, field: keyof SocialLink, value: string) => void
  onLogoChange: (type: "primaryLogo" | "iconLogo", dataUrl: string | null) => void
  onActiveSectionChange: (id: SectionId) => void
  scrollTargetRef: React.RefObject<HTMLDivElement | null>
}

const SECTION_IDS: SectionId[] = [
  "brand-details",
  "legal",
  "socials",
  "logos",
  "colors",
]

export function BrandForm({
  brandKit,
  onFieldChange,
  onColorChange,
  onAddSocial,
  onRemoveSocial,
  onUpdateSocial,
  onLogoChange,
  onActiveSectionChange,
  scrollTargetRef,
}: BrandFormProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const setupObserver = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)
          ) {
            bestEntry = entry
          }
        }
        if (bestEntry) {
          onActiveSectionChange(bestEntry.target.id as SectionId)
        }
      },
      {
        root: container,
        rootMargin: "-10% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    for (const id of SECTION_IDS) {
      const el = container.querySelector(`#${id}`)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [onActiveSectionChange])

  useEffect(() => {
    const cleanup = setupObserver()
    return cleanup
  }, [setupObserver])

  return (
    <div
      ref={(node) => {
        ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (scrollTargetRef) {
          ;(scrollTargetRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      }}
      className="flex-1 overflow-y-auto themed-scrollbar"
    >
      <div className="mx-auto max-w-xl px-8 py-8">
        <BrandDetailsSection
          brandKit={brandKit}
          onFieldChange={onFieldChange}
        />

        <Separator className="my-10" />

        <LegalSection
          brandKit={brandKit}
          onFieldChange={onFieldChange}
        />

        <Separator className="my-10" />

        <SocialsSection
          socials={brandKit.socials}
          onAdd={onAddSocial}
          onRemove={onRemoveSocial}
          onUpdate={onUpdateSocial}
        />

        <Separator className="my-10" />

        <LogosSection
          primaryLogo={brandKit.primaryLogo}
          iconLogo={brandKit.iconLogo}
          onLogoChange={onLogoChange}
        />

        <Separator className="my-10" />

        <ColorsSection
          colors={brandKit.colors}
          onColorChange={onColorChange}
        />

        {/* Bottom padding so the last section can scroll into view */}
        <div className="h-48" />
      </div>
    </div>
  )
}
