"use client"

import type { BrandKit } from "@/lib/brands/brand-types"

type EmailPreviewProps = {
  brandKit: BrandKit
}

export function EmailPreview({ brandKit }: EmailPreviewProps) {
  const { colors, copyright, address, primaryLogo, iconLogo } = brandKit
  const displayLogo = iconLogo || primaryLogo

  return (
    <div className="flex h-full items-stretch justify-center overflow-hidden border-l border-border/50 bg-muted/20 px-4 py-6 dark:bg-muted/10">
      <div
        className="flex h-full w-full max-w-[580px] flex-col overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5"
        style={{ backgroundColor: colors.background }}
      >
        {/* Email body */}
        <div
          className="mx-5 my-5 flex flex-1 flex-col justify-center rounded-xl px-6 py-8"
          style={{ backgroundColor: colors.container }}
        >
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            {displayLogo ? (
              <img
                src={displayLogo}
                alt="Brand logo"
                className="h-8 max-w-[140px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-neutral-900">
                  <div className="size-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  magicmail
                </span>
              </div>
            )}
          </div>

          {/* Heading */}
          <h2 className="mb-4 text-center text-2xl font-bold text-neutral-900">
            Welcome!
          </h2>

          {/* Body */}
          <p className="mb-4 text-center text-sm leading-relaxed text-neutral-600">
            Thank you for joining. We&apos;re glad to have you as part of our <br />
            community.
          </p>
          <p className="mb-6 text-center text-sm leading-relaxed text-neutral-600">
            To get the most out of your experience, please take a moment to
            complete your account setup.
          </p>

          {/* CTA */}
          <div className="mb-6 flex justify-center">
            <span
              className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold"
              style={{
                backgroundColor: colors.accent,
                color: colors.buttonText,
              }}
            >
              Complete Your Setup
            </span>
          </div>

          {/* Sub-text */}
          <p className="mb-5 text-center text-sm leading-relaxed text-neutral-500">
            If you have any questions or need assistance, don&apos;t hesitate to
            reach out to our support team.
          </p>

          {/* Sign off */}
          <p className="text-center text-sm text-neutral-600">
            Best regards,
            <br />
            Your Brand.
          </p>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-3/4 bg-neutral-200" />

          {/* Footer */}
          <div className="text-center text-[10px] leading-relaxed text-neutral-400">
            <p>{copyright || `© ${new Date().getFullYear()}`} Your Brand</p>
            {address && <p>{address}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
