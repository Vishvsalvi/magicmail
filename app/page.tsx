import { HomePageClient } from "@/components/home/home-page-client";
import { getProviderAvailability } from "@/lib/ai/models.server";

export default function HomePage() {
  const providerAvailability = getProviderAvailability();

  return <HomePageClient providerAvailability={providerAvailability} />;
}
