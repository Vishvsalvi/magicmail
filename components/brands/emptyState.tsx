"use client"

import { Button } from "@/components/ui/button"
type EmptyStateProps = {
  onAddBrand: () => void
}

export default function EmptyState({ onAddBrand }: EmptyStateProps) {

  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="max-w-2xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">No Brand Yet</h1>
        <p className="text-sm text-muted-foreground">
          Set your logo, colors, and type once to reuse them across <br /> all your
          email templates and stay on-brand every time.
        </p>
        <Button className="cursor-pointer" onClick={onAddBrand}>
          Add Brand
        </Button>
      </div>
    </section>
  )
}
