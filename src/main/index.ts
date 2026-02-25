#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DataForSEOClient, DataForSEOConfig } from '../core/client/dataforseo.client.js';
import { EnabledModulesSchema } from '../core/config/modules.config.js';
import { BaseModule, ToolDefinition } from '../core/modules/base.module.js';
import { z } from 'zod';
import { ModuleLoaderService } from "../core/utils/module-loader.js";
import { initializeFieldConfiguration } from '../core/config/field-configuration.js';
import { name, version } from '../core/utils/version.js';
import fs from 'node:fs';

function readSecret(name: string): string {
  const fileVar = process.env[`${name}_FILE`];
  if (fileVar) {
    try {
      return fs.readFileSync(fileVar, 'utf-8').trim();
    } catch (err) {
      console.error(`Failed to read ${name}_FILE at ${fileVar}:`, err);
      return '';
    }
  }
  return process.env[name] || '';
}

// Initialize field configuration if provided
initializeFieldConfiguration();
console.error('Starting DataForSEO MCP Server...');
console.error(`Server name: ${name}, version: ${version}`);
// Create server instance
const server = new McpServer({
    name,
    version,
});

// Initialize DataForSEO client
const dataForSEOConfig: DataForSEOConfig = {
  username: readSecret('DATAFORSEO_USERNAME'),
  password: readSecret('DATAFORSEO_PASSWORD'),
};

const dataForSEOClient = new DataForSEOClient(dataForSEOConfig);
console.error('DataForSEO client initialized');

// Parse enabled modules from environment
const enabledModules = EnabledModulesSchema.parse(process.env.ENABLED_MODULES);

// Initialize modules
const modules: BaseModule[] = ModuleLoaderService.loadModules(dataForSEOClient, enabledModules);
console.error('Modules initialized');

// Register tools from modules
function registerModuleTools() {
  modules.forEach(module => {
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

// Register all tools
registerModuleTools();
console.error('Tools registered');

// Start the server
async function main() {
  const transport = new StdioServerTransport(); 
  console.error('Starting server');
  await server.connect(transport);
  console.error("DataForSEO MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
