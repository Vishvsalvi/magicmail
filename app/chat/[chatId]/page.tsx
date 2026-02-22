import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { AppShell } from "@/components/common/app-shell/app-shell";
import { getProviderAvailability } from "@/lib/ai/models.server";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  const providerAvailability = getProviderAvailability();

  return (
    <AppShell defaultSidebarOpen={false}>
      <ChatWorkspace
        chatId={chatId}
        providerAvailability={providerAvailability}
      />
    </AppShell>
  );
}
