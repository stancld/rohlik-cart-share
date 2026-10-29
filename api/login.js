import { createHash, randomBytes } from "node:crypto";
import { IDENTITY, MCP, REDIRECT_URI, identity } from "./_rohlik.js";

const b64url = (buf) => buf.toString("base64url");

export async function GET(request) {
  const url = new URL(request.url);
  const { client_id } = await identity("/connect/register", {
    json: {
      client_name: "Rohlík cart share",
      redirect_uris: [REDIRECT_URI],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
  });
  const verifier = b64url(randomBytes(32));
  const state = b64url(randomBytes(16));
  const authorize = new URL(`${IDENTITY}/oauth2/authorize`);
  authorize.search = new URLSearchParams({
    response_type: "code",
    client_id,
    redirect_uri: REDIRECT_URI,
    // The MCP rejects tokens without the "roles" scope.
    scope: "openid email roles offline_access",
    code_challenge: b64url(createHash("sha256").update(verifier).digest()),
    code_challenge_method: "S256",
    state,
    resource: MCP,
  });
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      "set-cookie": `rcs=${client_id}.${verifier}.${state}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=600${secure}`,
    },
  });
}
