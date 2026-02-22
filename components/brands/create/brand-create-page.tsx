"use client"

import { useState, useCallback, useRef } from "react"
import { useBrandForm } from "@/hooks/use-brand-form"
import { AppShell } from "@/components/common/app-shell/app-shell"
import { SectionSidebar, type SectionId } from "./section-sidebar"
import { BrandForm } from "./brand-form"
import { EmailPreview } from "./email-preview"
import { SaveBrandButton } from "./save-brand-button"

export function BrandCreatePage() {
  const {
    brandKit,
    isSaved,
    updateField,
    updateColor,
    addSocial,
    removeSocial,
    updateSocial,
    setLogo,
    saveBrand,
  } = useBrandForm()

  const [activeSection, setActiveSection] = useState<SectionId>("brand-details")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleSectionClick = useCallback((id: SectionId) => {
    const container = scrollContainerRef.current
    if (!container) return

    const target = container.querySelector(`#${id}`)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <AppShell
      defaultSidebarOpen={false}
      headerTitle={
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          New Brand Kit
        </h1>
      }
      headerActions={<SaveBrandButton onSave={saveBrand} isSaved={isSaved} />}
      layoutVariant="brand-create"
    >
      <div className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)_620px]">
        {/* Left: Section navigation sidebar */}
        <SectionSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />

        {/* Center: Scrollable form */}
        <BrandForm
          brandKit={brandKit}
          onFieldChange={updateField}
          onColorChange={updateColor}
          onAddSocial={addSocial}
          onRemoveSocial={removeSocial}
          onUpdateSocial={updateSocial}
          onLogoChange={setLogo}
          onActiveSectionChange={setActiveSection}
          scrollTargetRef={scrollContainerRef}
        />

        {/* Right: Email preview */}
        <EmailPreview brandKit={brandKit} />
      </div>
    </AppShell>
  )
}
