export const IDENTITY = "https://identity.rohlik.cz";
export const MCP = "https://mcp.rohlik.cz/mcp";

// identity.rohlik.cz sits behind Cloudflare, which rejects non-browser user agents (error 1010).
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  accept: "application/json",
};

export async function identity(path, { json, form }) {
  const res = await fetch(IDENTITY + path, {
    method: "POST",
    headers: {
      ...HEADERS,
      "content-type": json ? "application/json" : "application/x-www-form-urlencoded",
    },
    body: json ? JSON.stringify(json) : new URLSearchParams(form),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} failed with ${res.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}
