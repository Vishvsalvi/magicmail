"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AppWindow, Code } from "lucide-react";

import { EditorLoader } from "@/components/chat/editorLoader";
import { PreviewLoader } from "@/components/chat/previewLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <EditorLoader />,
});

type ChatPreviewPanelProps = {
  code: string;
  canCompile?: boolean;
  frame?: "split" | "standalone";
  className?: string;
};

type MonacoTheme = "light" | "vs-dark";

const PREVIEW_CENTERING_STYLE = `
html, body {
  height: 100% !important;
  margin: 0 !important;
}

body {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 24px 16px !important;
  box-sizing: border-box !important;
  overflow: auto !important;
}
`;

function getMonacoTheme(): MonacoTheme {
  if (typeof document === "undefined") return "light";

  return document.documentElement.classList.contains("dark") ? "vs-dark" : "light";
}

function injectPreviewCenteringStyles(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const styleTag = `<style data-magicmail-preview-centering>${PREVIEW_CENTERING_STYLE}</style>`;

  if (/<\/head>/i.test(trimmed)) {
    return trimmed.replace(/<\/head>/i, `${styleTag}</head>`);
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);
  }

  return `<!doctype html><html><head>${styleTag}</head><body>${trimmed}</body></html>`;
}

export function ChatPreviewPanel({
  code,
  canCompile = true,
  frame = "standalone",
  className,
}: ChatPreviewPanelProps) {
  const [editorTheme, setEditorTheme] = useState<MonacoTheme>(() => getMonacoTheme());
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setEditorTheme(getMonacoTheme());
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canCompile) {
      setIsPreviewLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadPreview = async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const response = await fetch("/api/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          html?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Preview compilation failed.");
        }

        setPreviewHtml(injectPreviewCenteringStyles(payload.html ?? ""));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load preview.";
        setPreviewHtml("");
        setPreviewError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsPreviewLoading(false);
        }
      }
    };

    void loadPreview();

    return () => controller.abort();
  }, [code, canCompile]);

  const handlePreviewFrameLoad = useCallback((frame: HTMLIFrameElement) => {
    const frameDocument = frame.contentDocument;
    if (!frameDocument) return;

    const { documentElement, body } = frameDocument;
    if (!documentElement || !body) return;

    // Keep preview content centered while preserving scroll when the email is tall.
    documentElement.style.height = "100%";
    body.style.height = "100%";
    body.style.margin = "0";
    body.style.display = "flex";
    body.style.alignItems = "center";
    body.style.justifyContent = "center";
    body.style.padding = "24px 16px";
    body.style.boxSizing = "border-box";
    body.style.overflow = "auto";
    // body.style.backgroundColor = "#e5e7eb";
  }, []);

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
          {isPreviewLoading ? (
            <PreviewLoader />
          ) : previewError ? (
            <div className="themed-scrollbar h-full w-full overflow-y-auto p-4">
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {previewError}
              </div>
            </div>
          ) : (
            <iframe
              title="Email preview"
              srcDoc={previewHtml}
              onLoad={(event) => handlePreviewFrameLoad(event.currentTarget)}
              className="h-full w-full border-0 bg-white"
            />
          )}
        </TabsContent>

        <TabsContent
          value="code"
          className="min-h-0 overflow-hidden rounded-xl border border-border bg-background"
        >
          <MonacoEditor
            height="100%"
            language="typescript"
            value={code}
            theme={editorTheme}
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
