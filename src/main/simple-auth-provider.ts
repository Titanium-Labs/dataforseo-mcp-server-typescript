import { randomUUID } from "node:crypto";
import type { Response } from "express";
import type { OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type {
  OAuthClientInformationFull,
  OAuthTokenRevocationRequest,
  OAuthTokens,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { AuthorizationParams } from "@modelcontextprotocol/sdk/server/auth/provider.js";

interface PendingAuthCode {
  clientId: string;
  codeChallenge: string;
  redirectUri: string;
  expiresAt: number;
  /** DataForSEO credentials captured at authorization time */
  username: string;
  password: string;
}

interface TokenInfo extends AuthInfo {
  dataForSEOUsername: string;
  dataForSEOPassword: string;
}

/**
 * OAuth provider that authenticates users via their DataForSEO credentials.
 * Each issued Bearer token stores the credentials so MCP requests can call the DataForSEO API.
 */
export class DataForSEOAuthProvider implements OAuthServerProvider {
  private readonly clients = new Map<string, OAuthClientInformationFull>();
  private readonly authCodes = new Map<string, PendingAuthCode>();
  private readonly tokens = new Map<string, TokenInfo>();

  readonly clientsStore: OAuthRegisteredClientsStore = {
    getClient: (clientId: string) => this.clients.get(clientId),
    registerClient: (
      client: Omit<OAuthClientInformationFull, "client_id" | "client_id_issued_at">
    ): OAuthClientInformationFull => {
      const full: OAuthClientInformationFull = {
        ...client,
        client_id: randomUUID(),
        client_id_issued_at: Math.floor(Date.now() / 1000),
      };
      this.clients.set(full.client_id, full);
      return full;
    },
  };

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DataForSEO MCP – Sign In</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f0f2f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 10px; box-shadow: 0 2px 16px rgba(0,0,0,0.12); padding: 40px; width: 100%; max-width: 400px; }
    h1 { font-size: 1.35rem; margin-bottom: 6px; color: #111; }
    .subtitle { color: #666; font-size: 0.88rem; margin-bottom: 28px; }
    label { display: block; font-size: 0.82rem; font-weight: 600; color: #444; margin-bottom: 5px; }
    input[type=email], input[type=password] { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.95rem; margin-bottom: 16px; outline: none; }
    input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    button { width: 100%; padding: 11px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .footer { margin-top: 16px; font-size: 0.78rem; color: #888; text-align: center; }
    a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>DataForSEO MCP Server</h1>
    <p class="subtitle">Sign in with your DataForSEO account to continue.</p>
    <form method="POST" action="/oauth/authorize/submit">
      <input type="hidden" name="client_id" value="${escHtml(client.client_id)}" />
      <input type="hidden" name="redirect_uri" value="${escHtml(params.redirectUri)}" />
      <input type="hidden" name="state" value="${escHtml(params.state ?? "")}" />
      <input type="hidden" name="code_challenge" value="${escHtml(params.codeChallenge)}" />
      <label for="username">Email</label>
      <input type="email" id="username" name="username" placeholder="you@example.com" required autofocus />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="DataForSEO password" required />
      <button type="submit">Sign in</button>
    </form>
    <p class="footer">Don't have an account? <a href="https://app.dataforseo.com/register" target="_blank">Register at DataForSEO</a></p>
  </div>
</body>
</html>`);
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const entry = this.authCodes.get(authorizationCode);
    if (!entry) throw new Error("Invalid or expired authorization code");
    return entry.codeChallenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<OAuthTokens> {
    const entry = this.authCodes.get(authorizationCode);
    if (!entry || entry.clientId !== client.client_id) {
      throw new Error("Invalid authorization code");
    }
    if (Date.now() > entry.expiresAt) {
      this.authCodes.delete(authorizationCode);
      throw new Error("Authorization code expired");
    }
    this.authCodes.delete(authorizationCode);

    const accessToken = randomUUID();
    const expiresIn = 60 * 60 * 24 * 30; // 30 days
    this.tokens.set(accessToken, {
      token: accessToken,
      clientId: client.client_id,
      scopes: [],
      expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
      dataForSEOUsername: entry.username,
      dataForSEOPassword: entry.password,
    });

    return {
      access_token: accessToken,
      token_type: "bearer",
      expires_in: expiresIn,
    };
  }

  async exchangeRefreshToken(
    _client: OAuthClientInformationFull,
    _refreshToken: string
  ): Promise<OAuthTokens> {
    throw new Error("Refresh tokens are not supported");
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const info = this.tokens.get(token);
    if (!info) throw new Error("Invalid access token");
    if (info.expiresAt && info.expiresAt < Math.floor(Date.now() / 1000)) {
      this.tokens.delete(token);
      throw new Error("Access token expired");
    }
    return info;
  }

  async revokeToken(
    _client: OAuthClientInformationFull,
    request: OAuthTokenRevocationRequest
  ): Promise<void> {
    this.tokens.delete(request.token);
  }

  /** Returns stored DataForSEO credentials for a verified Bearer token */
  getCredentials(token: string): { username: string; password: string } | undefined {
    const info = this.tokens.get(token);
    if (!info) return undefined;
    return { username: info.dataForSEOUsername, password: info.dataForSEOPassword };
  }

  /** Stores an auth code after the user submits their credentials via the login form */
  issueAuthCode(
    username: string,
    password: string,
    clientId: string,
    codeChallenge: string,
    redirectUri: string
  ): string {
    const code = randomUUID();
    this.authCodes.set(code, {
      clientId,
      codeChallenge,
      redirectUri,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      username,
      password,
    });
    return code;
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
