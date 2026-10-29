import { MCP, identity } from "./_rohlik.js";

function redirect(location) {
  return new Response(null, {
    status: 302,
    headers: { location, "set-cookie": "rcs=; HttpOnly; SameSite=Lax; Path=/api; Max-Age=0" },
  });
}

export async function GET(request) {
  const url = new URL(request.url);
  const cookie = /(?:^|;\s*)rcs=([^;]*)/.exec(request.headers.get("cookie") ?? "")?.[1] ?? "";
  // client_id, verifier and state are base64url, so they never contain ".".
  const [clientId, verifier, state] = cookie.split(".");
  const code = url.searchParams.get("code");
  if (!code || !state || url.searchParams.get("state") !== state) {
    const reason = url.searchParams.get("error") ?? "Sign-in expired, please try again";
    return redirect(`/#error=${encodeURIComponent(reason)}`);
  }
  try {
    const token = await identity("/oauth2/token", {
      form: {
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        redirect_uri: `${url.origin}/api/callback`,
        code_verifier: verifier,
        resource: MCP,
      },
    });
    // The share secret lives in the URL fragment, so it never reaches any server log.
    const share = Buffer.from(JSON.stringify({ c: clientId, r: token.refresh_token })).toString("base64url");
    return redirect(`/#share=${share}`);
  } catch (error) {
    return redirect(`/#error=${encodeURIComponent(error.message)}`);
  }
}
