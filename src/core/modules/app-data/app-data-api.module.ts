import { BaseModule, ToolDefinition } from '../base.module.js';
import { AppDataGooglePlayAppSearchesTool } from './tools/google-play/google-play-app-searches.tool.js';
import { AppDataGooglePlayAppListTool } from './tools/google-play/google-play-app-list.tool.js';
import { AppDataGooglePlayAppInfoTool } from './tools/google-play/google-play-app-info.tool.js';
import { AppDataGooglePlayAppReviewsTool } from './tools/google-play/google-play-app-reviews.tool.js';
import { AppDataGooglePlayAppListingsSearchTool } from './tools/google-play/google-play-app-listings-search.tool.js';
import { AppDataAppleAppSearchesTool } from './tools/apple/apple-app-searches.tool.js';
import { AppDataAppleAppListTool } from './tools/apple/apple-app-list.tool.js';
import { AppDataAppleAppInfoTool } from './tools/apple/apple-app-info.tool.js';
import { AppDataAppleAppReviewsTool } from './tools/apple/apple-app-reviews.tool.js';
import { AppDataAppleAppListingsSearchTool } from './tools/apple/apple-app-listings-search.tool.js';
import { AppDataGoogleCategoriesTool } from './tools/app-data-categories.tool.js';
import { AppDataAppleCategoriesTool } from './tools/app-data-apple-categories.tool.js';

export class AppDataApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new AppDataGooglePlayAppSearchesTool(this.dataForSEOClient),
      new AppDataGooglePlayAppListTool(this.dataForSEOClient),
      new AppDataGooglePlayAppInfoTool(this.dataForSEOClient),
      new AppDataGooglePlayAppReviewsTool(this.dataForSEOClient),
      new AppDataGooglePlayAppListingsSearchTool(this.dataForSEOClient),
      new AppDataAppleAppSearchesTool(this.dataForSEOClient),
      new AppDataAppleAppListTool(this.dataForSEOClient),
      new AppDataAppleAppInfoTool(this.dataForSEOClient),
      new AppDataAppleAppReviewsTool(this.dataForSEOClient),
      new AppDataAppleAppListingsSearchTool(this.dataForSEOClient),
      new AppDataGoogleCategoriesTool(this.dataForSEOClient),
      new AppDataAppleCategoriesTool(this.dataForSEOClient),
    ];

    return tools.reduce((acc, tool) => ({
      ...acc,
      [tool.getName()]: {
        description: tool.getDescription(),
        params: tool.getParams(),
        handler: (params: any) => tool.handle(params),
      },
    }), {});
  }
}
