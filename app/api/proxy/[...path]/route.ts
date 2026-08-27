import { NextRequest, NextResponse } from "next/server";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.dileepa.dev"
).replace(/\/+$/, "");

/**
 * Proxy route for development environments.
 *
 * When developing locally with `NEXT_PUBLIC_API_URL` pointed at a remote API
 * (such as `https://api.dileepa.dev`), direct browser requests from `localhost`
 * are rejected by the remote API's CORS allowlist.
 *
 * This handler proxies client-side requests (reactions, comments, views, contact)
 * server-to-server, avoiding browser CORS blocks while leaving production
 * traffic direct.
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = new URL(`${API_URL}/${path.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const allowedHeaders = [
    "content-type",
    "accept",
    "authorization",
    "x-api-key",
  ];
  for (const header of allowedHeaders) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

  const clientIp =
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  if (clientIp) {
    headers.set("x-forwarded-for", clientIp);
  }

  const method = request.method;
  const body =
    method !== "GET" && method !== "HEAD" ? await request.text() : undefined;

  try {
    const upstream = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const copyHeaders = ["content-type", "retry-after"];
    for (const header of copyHeaders) {
      const value = upstream.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }

    const data = await upstream.text();
    return new NextResponse(data, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(
      `[proxy] Error forwarding ${method} ${targetUrl.pathname}:`,
      error,
    );
    return NextResponse.json(
      {
        error: {
          code: "proxy_error",
          message: "Failed to communicate with backend API",
        },
      },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
