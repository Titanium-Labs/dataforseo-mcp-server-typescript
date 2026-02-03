# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DataForSEO MCP Server is a TypeScript implementation of the Model Context Protocol (MCP) server that provides AI assistants access to DataForSEO APIs. The server exposes SEO data through multiple deployment modes: stdio (direct MCP), HTTP, SSE, and Cloudflare Workers.

## Build and Run Commands

### Development
```bash
# Build the project
npm run build

# Watch mode for development
npm run dev
```

### Running the Server
```bash
# Local stdio mode (default)
npx dataforseo-mcp-server
# or
npm run cli

# HTTP server mode
npm run http
# or
npx dataforseo-mcp-server http

# SSE mode
npm run sse
# or
npx dataforseo-mcp-server sse

# With field configuration
npx dataforseo-mcp-server http --configuration field-config.json

# Debug mode
npx dataforseo-mcp-server --debug
```

### Cloudflare Worker Deployment
```bash
# Build and type check worker
npm run worker:build

# Develop locally
npm run worker:dev

# Deploy to Cloudflare
npm run worker:deploy
```

### Required Environment Variables
```bash
export DATAFORSEO_USERNAME=your_username
export DATAFORSEO_PASSWORD=your_password

# Optional
export ENABLED_MODULES="SERP,KEYWORDS_DATA,ONPAGE,DATAFORSEO_LABS,BACKLINKS,BUSINESS_DATA,DOMAIN_ANALYTICS,CONTENT_ANALYSIS"
export DATAFORSEO_FULL_RESPONSE="false"  # Set to "true" for unfiltered API responses
```

## Architecture Overview

### Core Abstractions

**Three-layer architecture:**

1. **Client Layer** (`src/core/client/`): `DataForSEOClient` handles all HTTP communication with DataForSEO API
   - Automatically appends `.ai` suffix to endpoints when `DATAFORSEO_FULL_RESPONSE=false`
   - Manages Basic Authentication headers
   - Central request handler: `makeRequest<T>(endpoint, method, body, forceFull)`

2. **Module Layer** (`src/core/modules/`): Each module extends `BaseModule` and represents a DataForSEO API category
   - Modules return a map of tool definitions via `getTools()`
   - Instantiated conditionally based on `ENABLED_MODULES` environment variable
   - Module registration happens in `ModuleLoaderService.loadModules()` at `src/core/utils/module-loader.ts:14`

3. **Tool Layer**: Individual tools extend `BaseTool` and represent specific API endpoints
   - Each tool must implement: `getName()`, `getDescription()`, `getParams()`, `handle(params)`
   - Response validation and field filtering handled automatically by `BaseTool`
   - Tools define Zod schemas for parameter validation

### Module System

**Module registration flow:**
1. Modules defined in `AVAILABLE_MODULES` at `src/core/config/modules.config.ts:4`
2. Enabled modules parsed from env var via `EnabledModulesSchema` at `src/core/config/modules.config.ts:8`
3. `ModuleLoaderService` conditionally instantiates modules at `src/core/utils/module-loader.ts`
4. Main entry point (`src/main/index.ts:35`) loads modules and registers their tools with MCP server

**Available modules:**
- `SERP`: Google/Bing/Yahoo search results
- `KEYWORDS_DATA`: Keyword research and search volume data
- `ONPAGE`: Website crawling and on-page metrics
- `DATAFORSEO_LABS`: Proprietary DataForSEO datasets
- `BACKLINKS`: Backlink analysis and referring domains
- `BUSINESS_DATA`: Business listings and reviews
- `DOMAIN_ANALYTICS`: Website technologies and Whois data
- `CONTENT_ANALYSIS`: Brand monitoring and sentiment analysis

### Response Processing

**Two response modes controlled by `DATAFORSEO_FULL_RESPONSE`:**

1. **Filtered mode (default)**: Client appends `.ai` to endpoints, returns simplified `DataForSEOResponse` format
   - Response structure: `{ id, status_code, status_message, items[] }`
   - Validated via `validateResponse()` at `src/core/modules/base.tool.ts:94`

2. **Full mode**: Returns complete `DataForSEOFullResponse` with all metadata
   - Response structure: `{ version, status_code, time, cost, tasks[] }`
   - Validated via `validateResponseFull()` at `src/core/modules/base.tool.ts:100`

**Field filtering system:**
- Configuration loaded via `FieldConfigurationManager` singleton at `src/core/config/field-configuration.ts`
- Tools can specify default fields, overridden by config file or runtime `fields` parameter
- Nested field paths supported with dot notation (e.g., `items.rating.value`)
- Filtering applied in `formatResponse()` at `src/core/modules/base.tool.ts:62-72`

### Entry Points

- **Stdio**: `src/main/index.ts` - Direct MCP protocol via stdio transport
- **HTTP**: `src/main/index-http.ts` - Express server with Basic Auth or env var credentials
- **SSE**: `src/main/index-sse-http.ts` - Server-Sent Events transport (deprecated)
- **Worker**: `src/worker/index-worker.ts` - Cloudflare Worker with Durable Objects for session management
- **CLI**: `src/main/cli.ts` - Command-line interface that spawns appropriate server based on mode

## Adding New Tools or Modules

### Adding a Tool to Existing Module

1. Create tool file in module's `tools/` directory extending `BaseTool`
2. Implement required abstract methods: `getName()`, `getDescription()`, `getParams()`, `handle()`
3. Register tool in module's `getTools()` method
4. Tool automatically available when module is enabled

Example structure:
```typescript
export class YourTool extends BaseTool {
  getName() { return 'your-tool-name'; }

  getDescription() { return 'Tool description'; }

  getParams(): z.ZodRawShape {
    return {
      required_param: z.string().describe('Description'),
      optional_param: z.string().optional(),
    };
  }

  async handle(params: any) {
    const response = await this.dataForSEOClient.makeRequest(
      '/v3/path/to/endpoint',
      'POST',
      [{ ...params }]
    );

    return this.validateAndFormatResponse(response);
  }
}
```

### Creating a New Module

1. Create module directory under `src/core/modules/your-module/`
2. Create module class extending `BaseModule` with `getTools()` method
3. Add module name to `AVAILABLE_MODULES` in `src/core/config/modules.config.ts:4`
4. Register module in `ModuleLoaderService.loadModules()` at `src/core/utils/module-loader.ts`
5. Import and instantiate module in main entry points

## TypeScript Configuration

- **Main build**: `tsconfig.json` - compiles `src/` (excluding worker) to `build/main/`
- **Worker build**: `tsconfig.worker.json` - compiles worker code to `build/worker/`
- **Module system**: ES2022 with Node16 module resolution
- **Strict mode**: enabled with type checking

## Worker-Specific Details

- Uses Durable Objects (`DataForSEOMcpAgent`) for MCP session state management
- Supports both Streamable HTTP (`/mcp`) and SSE transports (deprecated `/sse`, `/messages`)
- Worker version auto-generated by `scripts/generate-worker-version.cjs` before build
- Environment variables must be set via `wrangler secret put` or `wrangler.jsonc` vars
- Health check available at `/health`, documentation at `/`

## Important Patterns

### Error Handling
- All errors formatted through `formatErrorResponse()` returning MCP-compatible structure
- API errors include status codes and messages from DataForSEO responses
- HTTP errors caught and re-thrown with context

### Tool Registration
Tools registered dynamically in `src/main/index.ts:39-53`:
```typescript
modules.forEach(module => {
  const tools = module.getTools();
  Object.entries(tools).forEach(([name, tool]) => {
    const schema = z.object(tool.params);
    server.tool(name, tool.description, schema.shape, tool.handler);
  });
});
```

### Response Transformation
Response path: `API → Client → Tool.handle() → validateResponse() → formatResponse() → field filtering → JSON string`

### Base URL Modification
Client automatically modifies URLs based on response mode:
- Filtered: `https://api.dataforseo.com/v3/endpoint.ai`
- Full: `https://api.dataforseo.com/v3/endpoint`

This allows tools to use same endpoint paths regardless of response mode.
