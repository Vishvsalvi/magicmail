import { AppShell } from "@/components/common/app-shell/app-shell";

export default function BrandsPage() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <p className="text-sm text-muted-foreground">
          Manage your brand workspace, voice settings, and asset collections here.
        </p>
      </main>
    </AppShell>
  );
}
