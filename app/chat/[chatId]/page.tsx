import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { AppShell } from "@/components/common/app-shell/app-shell";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  return (
    <AppShell defaultSidebarOpen={false}>
      <ChatWorkspace chatId={chatId} />
    </AppShell>
  );
}
