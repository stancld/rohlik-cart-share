# Rohlík cart share

Share your Rohlík cart with someone who isn't logged in to your account.

1. Open the app and sign in with Rohlík (Apple sign-in works).
2. Copy the share link and send it. Whoever opens it can view the cart, search products, and change quantities.

Everything runs in the browser and talks to the official Rohlík MCP (`https://mcp.rohlik.cz/mcp`).
Three small Vercel functions in `api/` handle the parts Rohlík's sign-in server blocks from browsers:
`login` and `callback` do the OAuth sign-in, and `token` exchanges the link's refresh token for an access token. Nothing is stored server-side.

The share link carries a refresh token for your account in the URL fragment. Anyone holding it has full account access, so treat it like a password.
