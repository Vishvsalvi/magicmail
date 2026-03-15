import { NextResponse } from "next/server";

import { EmailPreviewError, compileEmail } from "@/lib/email-preview/compile-email";
import { parseJsonBody, isErrorResponse } from "@/lib/api-utils";

type PreviewRequestBody = {
  code?: unknown;
};

export async function POST(req: Request) {
  const bodyOrError = await parseJsonBody<PreviewRequestBody>(req);
  if (isErrorResponse(bodyOrError)) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const body = bodyOrError;

  if (typeof body.code !== "string") {
    return NextResponse.json({ error: "Request body must include a string `code`." }, { status: 400 });
  }

  try {
    const result = await compileEmail(body.code);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof EmailPreviewError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Failed to generate preview.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
