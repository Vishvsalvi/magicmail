"use client";

import dynamic from "next/dynamic";
import { AppWindow, Code } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

type ChatPreviewPanelProps = {
  code: string;
  frame?: "split" | "standalone";
  className?: string;
};

export function ChatPreviewPanel({
  code,
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
      <Tabs
        defaultValue="preview"
        className="flex h-full min-h-0 flex-col gap-3 bg-transparent p-3"
      >
        <TabsList className="h-11 rounded-xl border border-border/80 bg-muted/70 p-1">
          <TabsTrigger value="preview" className=" rounded-lg">
            <AppWindow className="size-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className=" rounded-lg">
            <Code className="size-4" />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="preview"
          className="min-h-0 overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="themed-scrollbar h-full w-full overflow-y-auto" />
        </TabsContent>

        <TabsContent
          value="code"
          className="min-h-0 overflow-hidden rounded-xl border border-border bg-background"
        >
          <MonacoEditor
            height="100%"
            language="typescript"
            value={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbersMinChars: 3,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
            }}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
