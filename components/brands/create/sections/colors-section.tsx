"use client"

import { useRef } from "react"
import type { BrandColors } from "@/lib/brands/brand-types"

type ColorsSectionProps = {
  colors: BrandColors
  onColorChange: (key: keyof BrandColors, value: string) => void
}

const COLOR_FIELDS: {
  key: keyof BrandColors
  label: string
  description: string
}[] = [
  {
    key: "background",
    label: "Background",
    description: "The main background of your email",
  },
  {
    key: "container",
    label: "Container",
    description: "The content box of the email",
  },
  {
    key: "accent",
    label: "Accent",
    description: "Buttons, links, and highlights",
  },
  {
    key: "buttonText",
    label: "Button Text",
    description: "Text on buttons",
  },
]

function ColorPickerBox({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/60 shadow-sm transition-all hover:border-muted-foreground/40 hover:shadow-md"
        style={{ backgroundColor: value }}
      >
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </button>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function ColorsSection({
  colors,
  onColorChange,
}: ColorsSectionProps) {
  return (
    <section id="colors" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Colors</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the look and feel of your email with your brand colors.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {COLOR_FIELDS.map((field) => (
          <ColorPickerBox
            key={field.key}
            label={field.label}
            description={field.description}
            value={colors[field.key]}
            onChange={(v) => onColorChange(field.key, v)}
          />
        ))}
      </div>
    </section>
  )
}
