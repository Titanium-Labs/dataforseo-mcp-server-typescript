#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  DataForSEOClient,
  DataForSEOConfig,
} from "../core/client/dataforseo.client.js";
import { SerpApiModule } from "../core/modules/serp/serp-api.module.js";
import { KeywordsDataApiModule } from "../core/modules/keywords-data/keywords-data-api.module.js";
import { OnPageApiModule } from "../core/modules/onpage/onpage-api.module.js";
import { DataForSEOLabsApi } from "../core/modules/dataforseo-labs/dataforseo-labs-api.module.js";
import {
  EnabledModulesSchema,
  isModuleEnabled,
  defaultEnabledModules,
} from "../core/config/modules.config.js";
import { BaseModule, ToolDefinition } from "../core/modules/base.module.js";
import { z } from "zod";
import { BacklinksApiModule } from "../core/modules/backlinks/backlinks-api.module.js";
import { BusinessDataApiModule } from "../core/modules/business-data-api/business-data-api.module.js";
import { DomainAnalyticsApiModule } from "../core/modules/domain-analytics/domain-analytics-api.module.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import express, {
  Request as ExpressRequest,
  Response,
  NextFunction,
} from "express";
import { randomUUID } from "node:crypto";
import {
  GetPromptResult,
  isInitializeRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { name, version } from "../core/utils/version.js";
import { ModuleLoaderService } from "../core/utils/module-loader.js";
import { initializeFieldConfiguration } from "../core/config/field-configuration.js";
import fs from "node:fs";
import { DataForSEOAuthProvider } from "./simple-auth-provider.js";

// Initialize field configuration if provided
initializeFieldConfiguration();

// Extended request interface to include auth properties
interface Request extends ExpressRequest {
  username?: string;
  password?: string;
}

console.error("Starting DataForSEO MCP Server...");
console.error(`Server name: ${name}, version: ${version}`);

function getServer(
  username: string | undefined,
  password: string | undefined
): McpServer {
  const server = new McpServer(
    {
      name,
      version,
    },
    { capabilities: { logging: {} } }
  );
  // Initialize DataForSEO client
  const dataForSEOConfig: DataForSEOConfig = {
    username: username || "",
    password: password || "",
  };

  const dataForSEOClient = new DataForSEOClient(dataForSEOConfig);
  console.error("DataForSEO client initialized");

  // Parse enabled modules from environment
  const enabledModules = EnabledModulesSchema.parse(
    process.env.ENABLED_MODULES
  );

  // Initialize modules
  const modules: BaseModule[] = ModuleLoaderService.loadModules(
    dataForSEOClient,
    enabledModules
  );

  console.error("Modules initialized");
  function registerModuleTools() {
    console.error("Registering tools");
    console.error(modules.length);
    modules.forEach((module) => {
      const tools = module.getTools();
      Object.entries(tools).forEach(([name, tool]) => {
        const typedTool = tool as ToolDefinition;
        const schema = z.object(typedTool.params);
        server.tool(
          name,
          typedTool.description,
          schema.shape,
          typedTool.handler
        );
      });
    });
  }
  registerModuleTools();
  console.error("Tools registered");
  return server;
}

function getSessionId() {
  return randomUUID().toString();
}

function readSecret(secretName: string): string | undefined {
  const fileVar = process.env[`${secretName}_FILE`];
  if (fileVar) {
    try {
      return fs.readFileSync(fileVar, "utf-8").trim();
    } catch (err) {
      console.error(`Failed to read ${secretName}_FILE at ${fileVar}:`, err);
      return undefined;
    }
  }
  return process.env[secretName] || undefined;
}

/**
 * Extracts DataForSEO credentials from an Authorization: Basic header.
 * Returns undefined if the header is absent or malformed.
 */
function extractBasicAuth(authHeader: string | undefined): { username: string; password: string } | undefined {
  if (!authHeader?.startsWith("Basic ")) return undefined;
  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  const colon = decoded.indexOf(":");
  if (colon < 1) return undefined;
  return { username: decoded.slice(0, colon), password: decoded.slice(colon + 1) };
}

async function main() {
  const app = express();
  app.use(express.json());

  //=============================================================================
  // SERVER INFO & HEALTH
  //=============================================================================

  const serverInfoPayload = {
    name,
    version,
    description: 'DataForSEO MCP Server — modular SEO API integration with HTTP transport and OAuth',
    transports: {
      streamableHttp: {
        endpoint: '/http',
        methods: ['POST'],
        protocol: '2025-03-26',
      },
    },
    health: '/health',
  };

  app.get('/', (_req: ExpressRequest, res: Response) => {
    res.status(200).json(serverInfoPayload);
  });

  app.get('/health', (_req: ExpressRequest, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // MCP endpoint URL used for OAuth protected resource metadata
  const publicUrl = readSecret("MCP_PUBLIC_URL") || "http://localhost:3000";
  const issuerUrl = new URL(publicUrl);
  const mcpEndpointUrl = new URL("/http", issuerUrl);
  const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(mcpEndpointUrl);

  const authProvider = new DataForSEOAuthProvider();

  // Mount OAuth discovery + token endpoints at app root
  app.use(
    mcpAuthRouter({
      provider: authProvider,
      issuerUrl,
      baseUrl: issuerUrl,
      resourceServerUrl: mcpEndpointUrl,
      resourceName: "DataForSEO MCP Server",
    })
  );

  // Form submission handler – user enters DataForSEO credentials, issues auth code
  app.post(
    "/oauth/authorize/submit",
    express.urlencoded({ extended: false }),
    (req, res) => {
      const { username, password, client_id, redirect_uri, state, code_challenge } =
        req.body as Record<string, string>;

      if (!username?.trim() || !password?.trim() || !client_id || !redirect_uri || !code_challenge) {
        res.status(400).send(renderLoginForm(client_id, redirect_uri, state, code_challenge, "All fields are required."));
        return;
      }

      const code = authProvider.issueAuthCode(
        username.trim(),
        password,
        client_id,
        code_challenge,
        redirect_uri
      );

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set("code", code);
      if (state) redirectUrl.searchParams.set("state", state);
      res.redirect(302, redirectUrl.href);
    }
  );

  // Bearer auth middleware for requests coming through the OAuth flow
  const bearerAuth = requireBearerAuth({ verifier: authProvider, resourceMetadataUrl });

  // MCP endpoint: accepts both Basic Auth (direct config) and Bearer (OAuth flow)
  app.post("/http", async (req: Request, res: Response, next: NextFunction) => {
    // Option A: credentials supplied directly via Basic Auth header in Claude Desktop config
    const basic = extractBasicAuth(req.headers.authorization);
    if (basic) {
      req.username = basic.username;
      req.password = basic.password;
      await handleMcpRequest(req, res);
      return;
    }

    // Option B: Bearer token from OAuth flow
    bearerAuth(req, res, async () => {
      // After bearerAuth, look up the DataForSEO credentials stored for this token
      const token = req.headers.authorization?.slice(7) ?? "";
      const creds = authProvider.getCredentials(token);
      if (!creds) {
        res.status(401).json({ jsonrpc: "2.0", error: { code: -32001, message: "Invalid token" }, id: null });
        return;
      }
      req.username = creds.username;
      req.password = creds.password;
      await handleMcpRequest(req, res);
    });
  });

  app.get("/http", (_req: Request, res: Response) => {
    res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null });
  });

  app.delete("/http", (_req: Request, res: Response) => {
    res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null });
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const httpServer = app.listen(PORT, () => {
    console.log(`DataForSEO MCP Server listening on port ${PORT}`);
    console.log(`  Streamable HTTP: /http`);
    console.log(`  Health:          /health`);
    console.log(`  Info:            /`);
  });

  // Graceful shutdown
  async function shutdown(signal: string) {
    console.log(`\n${signal} received, shutting down...`);
    httpServer.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
    // Force exit after 5s if connections don't close
    setTimeout(() => process.exit(1), 5000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

async function handleMcpRequest(req: Request, res: Response) {
  try {
    console.error(Date.now().toLocaleString());
    const server = getServer(req.username, req.password);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    console.error("handle request");
    await transport.handleRequest(req, res, req.body);
    console.error("end handle request");
    req.on("close", () => {
      console.error("Request closed");
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error("Error handling HTTP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
}

function renderLoginForm(
  clientId: string,
  redirectUri: string,
  state: string,
  codeChallenge: string,
  errorMsg?: string
): string {
  const err = errorMsg
    ? `<p style="color:#dc2626;font-size:0.85rem;margin-bottom:14px">${escHtml(errorMsg)}</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DataForSEO MCP – Sign In</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f0f2f5;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{background:#fff;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,.12);padding:40px;width:100%;max-width:400px}h1{font-size:1.35rem;margin-bottom:6px;color:#111}.subtitle{color:#666;font-size:.88rem;margin-bottom:24px}label{display:block;font-size:.82rem;font-weight:600;color:#444;margin-bottom:5px}input[type=email],input[type=password]{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:.95rem;margin-bottom:14px;outline:none}input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}button{width:100%;padding:11px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:1rem;font-weight:600;cursor:pointer}button:hover{background:#1d4ed8}.footer{margin-top:14px;font-size:.78rem;color:#888;text-align:center}a{color:#2563eb;text-decoration:none}</style>
</head><body><div class="card">
<h1>DataForSEO MCP Server</h1>
<p class="subtitle">Sign in with your DataForSEO account to continue.</p>
${err}
<form method="POST" action="/oauth/authorize/submit">
<input type="hidden" name="client_id" value="${escHtml(clientId)}"/>
<input type="hidden" name="redirect_uri" value="${escHtml(redirectUri)}"/>
<input type="hidden" name="state" value="${escHtml(state)}"/>
<input type="hidden" name="code_challenge" value="${escHtml(codeChallenge)}"/>
<label for="username">Email</label>
<input type="email" id="username" name="username" placeholder="you@example.com" required autofocus/>
<label for="password">Password</label>
<input type="password" id="password" name="password" placeholder="DataForSEO password" required/>
<button type="submit">Sign in</button>
</form>
<p class="footer">No account? <a href="https://app.dataforseo.com/register" target="_blank">Register at DataForSEO</a></p>
</div></body></html>`;
}

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
