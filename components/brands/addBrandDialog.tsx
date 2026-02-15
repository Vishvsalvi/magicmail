"use client"

import { type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Plus, Sparkles } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type AddBrandDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type BrandOptionProps = {
  title: string
  description: string
  icon: ReactNode
  onClick?: () => void
  disabled?: boolean
}

function BrandOption({
  title,
  description,
  icon,
  onClick,
  disabled = false,
}: BrandOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border bg-card px-4 py-6 text-center transition-colors hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-card"
    >
      <span className="mb-4 inline-flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

export default function AddBrandDialog({
  open,
  onOpenChange,
}: AddBrandDialogProps) {
  const router = useRouter()

  const handleStartFromScratch = () => {
    onOpenChange(false)
    router.push("/brands/create")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-lg gap-6 p-6 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Set up your Brand Kit
          </DialogTitle>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <BrandOption
            icon={<Sparkles className="size-5" />}
            title="Match my brand"
            description="Automatically match your website's branding"
            disabled
          />
          <BrandOption
            icon={<Plus className="size-5" />}
            title="Start from scratch"
            description="Upload your own logos, colors, and branded assets"
            onClick={handleStartFromScratch}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
