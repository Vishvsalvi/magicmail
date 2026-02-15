import React from "react";
import { transform } from "esbuild";
import * as ReactEmailComponents from "@react-email/components";
import { render } from "@react-email/render";
import * as ReactJsxRuntime from "react/jsx-runtime";

type CompiledPreviewResult = {
  html: string;
};

type PreviewErrorStage = "compile" | "runtime" | "render";

export class EmailPreviewError extends Error {
  readonly stage: PreviewErrorStage;

  constructor(message: string, stage: PreviewErrorStage) {
    super(message);
    this.name = "EmailPreviewError";
    this.stage = stage;
  }
}

type SecurityPhase = "source" | "compiled";

type DangerousPattern = {
  pattern: RegExp;
  message: string;
};

// We scan raw source and transpiled output because unsafe behavior can surface at either stage.
const dangerousPatterns: DangerousPattern[] = [
  {
    pattern: /\b(?:fs|require\(['"]fs['"]|import\s+.*fs\b)/,
    message: "File system operations are not allowed",
  },
  {
    pattern: /\b(?:process\.env|process\.[a-zA-Z])/,
    message: "Process access is not allowed",
  },
  {
    pattern: /\b(?:eval\(|Function\s*\()/,
    message: "Dynamic code execution is not allowed",
  },
  {
    pattern: /\bfetch\s*\(|XMLHttpRequest|axios\.(get|post|put|delete)|http\.(get|post|put|delete)/,
    message: "Network requests are not allowed",
  },
  {
    pattern: /\b(?:require\(['"]child_process|import\s+.*child_process\b)/,
    message: "Child process operations are not allowed",
  },
  {
    pattern: /\b(?:require\(['"]net|import\s+.*net\b)/,
    message: "Network module access is not allowed",
  },
  {
    pattern: /\b(?:require\(['"]os|import\s+.*os\b)/,
    message: "OS module access is not allowed",
  },
  {
    pattern: /\b(?:require\(['"]path|import\s+.*path\b)/,
    message: "Path operations are not allowed",
  },
  {
    pattern: /\b(?:setTimeout|setInterval)\s*\([^,]*,\s*[0-9]/,
    message: "Timer operations are not allowed",
  },
  {
    pattern: /\b(?:console\.(log|error|warn|info|debug))\s*\(/,
    message: "Console operations should be avoided in email components",
  },
  {
    pattern: /\b(?:document\.|window\.|global\.)/,
    message: "Browser DOM access is not allowed in email components",
  },
];

const dangerousImports = [
  "fs",
  "path",
  "os",
  "child_process",
  "net",
  "http",
  "https",
  "url",
  "crypto",
  "cluster",
  "dgram",
  "dns",
  "readline",
  "repl",
  "timers",
  "tty",
  "util",
  "v8",
  "vm",
  "worker_threads",
  "zlib",
];

const moduleSpecifierPatterns = [
  /\bimport\s+(?:[^"'();]+?\s+from\s+)?["']([^"']+)["']/g,
  /\bexport\s+[^"'();]*?\s+from\s+["']([^"']+)["']/g,
  /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
];

function extractModuleSpecifiers(code: string): string[] {
  const specifiers: string[] = [];

  for (const pattern of moduleSpecifierPatterns) {
    for (const match of code.matchAll(pattern)) {
      if (match[1]) {
        specifiers.push(match[1]);
      }
    }
  }

  return specifiers;
}

function normalizeModuleSpecifier(specifier: string): string {
  return specifier.startsWith("node:") ? specifier.slice("node:".length) : specifier;
}

function findDangerousImportViolation(code: string): string | null {
  const specifiers = extractModuleSpecifiers(code);

  for (const specifier of specifiers) {
    const normalizedSpecifier = normalizeModuleSpecifier(specifier);
    const blockedImport = dangerousImports.find(
      (dangerousImport) =>
        normalizedSpecifier === dangerousImport || normalizedSpecifier.startsWith(`${dangerousImport}/`)
    );

    if (blockedImport) {
      return `Import "${specifier}" is not allowed (dangerous module "${blockedImport}").`;
    }
  }

  return null;
}

function findDangerousPatternViolation(code: string): string | null {
  // Patterns catch risky runtime APIs that are not always visible as module imports.
  for (const dangerousPattern of dangerousPatterns) {
    if (dangerousPattern.pattern.test(code)) {
      return dangerousPattern.message;
    }
  }

  return null;
}

function runSecurityCheck(code: string, phase: SecurityPhase): void {
  // Import and pattern checks are split so each phase reports the first deterministic violation.
  const importViolation = findDangerousImportViolation(code);

  if (importViolation) {
    throw new EmailPreviewError(`Security check failed in ${phase} code: ${importViolation}`, "compile");
  }

  const patternViolation = findDangerousPatternViolation(code);

  if (patternViolation) {
    throw new EmailPreviewError(
      `Security check failed in ${phase} code: ${patternViolation}`,
      "compile"
    );
  }
}

export async function compileEmail(code: string): Promise<CompiledPreviewResult> {
  runSecurityCheck(code, "source");

  let compiledCode: string;

  try {
    const result = await transform(code, {
      loader: "tsx",
      format: "cjs",
      jsx: "automatic",
      jsxImportSource: "react",
      platform: "node",
      target: "es2020",
      sourcefile: "email-preview.tsx",
      sourcemap: false,
    });
    compiledCode = result.code;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to compile email code.";
    throw new EmailPreviewError(message, "compile");
  }

  runSecurityCheck(compiledCode, "compiled");

  const runtimeModule = { exports: {} as unknown };
  const runtimeExports = runtimeModule.exports;

  // Runtime import allowlist remains as a final guard even after static security scans.
  const runtimeRequire = (specifier: string): unknown => {
    if (specifier === "react") return React;
    if (specifier === "react/jsx-runtime") return ReactJsxRuntime;
    if (specifier === "@react-email/components") return ReactEmailComponents;

    throw new EmailPreviewError(`Unsupported import: "${specifier}".`, "runtime");
  };

  try {
    const evaluator = new Function("require", "module", "exports", compiledCode);
    evaluator(runtimeRequire, runtimeModule, runtimeExports);
  } catch (error) {
    if (error instanceof EmailPreviewError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Failed to execute email code.";
    throw new EmailPreviewError(message, "runtime");
  }

  const evaluatedModule = runtimeModule.exports as
    | {
        default?: unknown;
      }
    | undefined;

  const componentCandidate = evaluatedModule?.default ?? evaluatedModule;

  if (typeof componentCandidate !== "function") {
    throw new EmailPreviewError(
      "Email module must export a default React component.",
      "runtime"
    );
  }

  try {
    const element = React.createElement(componentCandidate as React.ComponentType<Record<string, never>>, {});
    const html = await render(element);
    return { html };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to render email preview.";
    throw new EmailPreviewError(message, "render");
  }
}
