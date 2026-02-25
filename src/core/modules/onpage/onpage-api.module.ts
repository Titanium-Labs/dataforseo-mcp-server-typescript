import { BaseModule, ToolDefinition } from '../base.module.js';
import { ContentParsingTool } from './tools/content-parsing.tool.js';
import { InstantPagesTool } from './tools/instant-pages.tool.js';
import { OnPageTaskPostTool } from './tools/onpage-task-post.tool.js';
import { OnPageSummaryTool } from './tools/onpage-summary.tool.js';
import { OnPagePagesTool } from './tools/onpage-pages.tool.js';
import { OnPageResourcesTool } from './tools/onpage-resources.tool.js';
import { OnPageLinksTool } from './tools/onpage-links.tool.js';
import { OnPageRedirectChainsTool } from './tools/onpage-redirect-chains.tool.js';
import { OnPageNonIndexableTool } from './tools/onpage-non-indexable.tool.js';
import { OnPageDuplicateTagsTool } from './tools/onpage-duplicate-tags.tool.js';
import { OnPageDuplicateContentTool } from './tools/onpage-duplicate-content.tool.js';
import { OnPageKeywordDensityTool } from './tools/onpage-keyword-density.tool.js';
import { OnPageWaterfallTool } from './tools/onpage-waterfall.tool.js';
import { OnPagePageScreenshotTool } from './tools/onpage-page-screenshot.tool.js';
import { OnPageLighthouseLiveJsonTool } from './tools/onpage-lighthouse-live-json.tool.js';
import { OnPageLighthouseTaskPostTool } from './tools/onpage-lighthouse-task-post.tool.js';
import { OnPageForceStopTool } from './tools/onpage-force-stop.tool.js';

export class OnPageApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new ContentParsingTool(this.dataForSEOClient),
      new InstantPagesTool(this.dataForSEOClient),
      new OnPageTaskPostTool(this.dataForSEOClient),
      new OnPageSummaryTool(this.dataForSEOClient),
      new OnPagePagesTool(this.dataForSEOClient),
      new OnPageResourcesTool(this.dataForSEOClient),
      new OnPageLinksTool(this.dataForSEOClient),
      new OnPageRedirectChainsTool(this.dataForSEOClient),
      new OnPageNonIndexableTool(this.dataForSEOClient),
      new OnPageDuplicateTagsTool(this.dataForSEOClient),
      new OnPageDuplicateContentTool(this.dataForSEOClient),
      new OnPageKeywordDensityTool(this.dataForSEOClient),
      new OnPageWaterfallTool(this.dataForSEOClient),
      new OnPagePageScreenshotTool(this.dataForSEOClient),
      new OnPageLighthouseLiveJsonTool(this.dataForSEOClient),
      new OnPageLighthouseTaskPostTool(this.dataForSEOClient),
      new OnPageForceStopTool(this.dataForSEOClient),
      // Add more tools here
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
