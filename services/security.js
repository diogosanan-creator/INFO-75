function requestIsSecure(request, appBaseUrl) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  if (typeof forwardedProto === "string" && forwardedProto.split(",")[0].trim() === "https") return true;
  if (request.socket && request.socket.encrypted) return true;
  return appBaseUrl.startsWith("https://");
}

function sessionCookieHeader(token, maxAgeSeconds, request, options) {
  const parts = [
    `${options.cookieName}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (requestIsSecure(request, options.appBaseUrl)) parts.push("Secure");
  return parts.join("; ");
}

function baseSecurityHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };
}

module.exports = {
  requestIsSecure,
  sessionCookieHeader,
  baseSecurityHeaders,
};
