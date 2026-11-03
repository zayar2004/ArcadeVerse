import "server-only";

export function isTrustedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  let receivedOrigin: string;

  try {
    receivedOrigin = new URL(origin).origin;
  } catch {
    return false;
  }

  const configuredOrigin = process.env.APP_ORIGIN;

  if (configuredOrigin) {
    try {
      return receivedOrigin === new URL(configuredOrigin).origin;
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const requestUrl = new URL(request.url);
    const isLocalHost =
      requestUrl.hostname === "localhost" ||
      requestUrl.hostname === "127.0.0.1";

    return isLocalHost && receivedOrigin === requestUrl.origin;
  } catch {
    return false;
  }
}
