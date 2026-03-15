/**
 * Parses the JSON body of a Request. Returns the parsed body or a 400 Response on failure.
 */
export async function parseJsonBody<T>(req: Request): Promise<T | Response> {
  try {
    return (await req.json()) as T;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }
}

/**
 * Returns true if the value is a Response (i.e., an error from parseJsonBody).
 */
export function isErrorResponse(value: unknown): value is Response {
  return value instanceof Response;
}
