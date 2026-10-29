import { identity } from "./_rohlik.js";

// identity.rohlik.cz has no CORS, so the browser exchanges its refresh token here. Nothing is stored.
export async function POST(request) {
  try {
    const { c, r } = await request.json();
    const token = await identity("/oauth2/token", {
      form: { grant_type: "refresh_token", refresh_token: r, client_id: c },
    });
    return Response.json({ access_token: token.access_token, expires_in: token.expires_in });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 });
  }
}
