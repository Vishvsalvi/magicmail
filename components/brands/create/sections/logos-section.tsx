"use client"

import { useRef, useCallback } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type LogosSectionProps = {
  primaryLogo: string | null
  iconLogo: string | null
  onLogoChange: (type: "primaryLogo" | "iconLogo", dataUrl: string | null) => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function LogoUploadBox({
  label,
  description,
  value,
  onUpload,
  onClear,
}: {
  label: string
  description: string
  value: string | null
  onUpload: (dataUrl: string) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const dataUrl = await fileToDataUrl(file)
      onUpload(dataUrl)
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ""
    },
    [onUpload]
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        {value ? (
          <div className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
            <img
              src={value}
              alt={label}
              className="max-h-full max-w-full object-contain p-4"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onClear}
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 hover:bg-background"
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/50 transition-colors hover:border-muted-foreground/40 hover:bg-muted/70 dark:bg-muted/30 dark:hover:bg-muted/50"
          >
            <Plus className="size-6 text-muted-foreground" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function LogosSection({
  primaryLogo,
  iconLogo,
  onLogoChange,
}: LogosSectionProps) {
  return (
    <section id="logos" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Logos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the logos that represent your brand.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LogoUploadBox
          label="Primary"
          description="Your main logo, usually full-width"
          value={primaryLogo}
          onUpload={(url) => onLogoChange("primaryLogo", url)}
          onClear={() => onLogoChange("primaryLogo", null)}
        />
        <LogoUploadBox
          label="Icon"
          description="A simplified version"
          value={iconLogo}
          onUpload={(url) => onLogoChange("iconLogo", url)}
          onClear={() => onLogoChange("iconLogo", null)}
        />
      </div>
    </section>
  )
}
