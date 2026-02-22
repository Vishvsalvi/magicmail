import { AppShell } from "@/components/common/app-shell/app-shell";
import BrandsPageContent from "@/components/brands/brandsPageContent";

export default function BrandsPage() {
  return (
    <AppShell>
      <h1 className="pl-[50px] text-2xl font-medium">Brands</h1>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
        <BrandsPageContent />
      </main>
    </AppShell>
  );
}
