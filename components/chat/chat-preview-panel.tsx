import { cn } from "@/lib/utils";

type ChatPreviewPanelProps = {
  frame?: "split" | "standalone";
  className?: string;
};

export function ChatPreviewPanel({
  frame = "standalone",
  className,
}: ChatPreviewPanelProps) {
  return (
    <section
      className={cn(
        "h-full w-full overflow-hidden rounded-sm border border-border bg-card",
        className,
        frame === "split" && "border-l rounded-tl-sm rounded-tr-sm"
      )}
      aria-label="Preview panel"
    >
      <div className="h-full w-full" />
    </section>
  );
}
