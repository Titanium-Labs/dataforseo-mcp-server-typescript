import { BaseModule, ToolDefinition } from '../base.module.js';
import { DataForSeoTrendsDemographyTool } from './tools/dataforseo-trends/dataforseo-trends-demography.tool.js';
import { DataForSeoTrendsExploreTool } from './tools/dataforseo-trends/dataforseo-trends-explore.tool.js';
import { DataForSeoTrendsSubregionInterestsTool } from './tools/dataforseo-trends/dataforseo-trends-subregion-interests.tool.js';
import { GoogleAdsSearchVolumeTool } from './tools/google-ads/google-ads-search-volume.tool.js';
import { GoogleTrendsCategoriesTool } from './tools/google-trends/google-trends-categories.tool.js';
import { GoogleTrendsExploreTool } from './tools/google-trends/google-trends-explore.tool.js';
import { GoogleAdsKeywordsForSiteTool } from './tools/google-ads/google-ads-keywords-for-site.tool.js';
import { GoogleAdsKeywordsForKeywordsTool } from './tools/google-ads/google-ads-keywords-for-keywords.tool.js';
import { GoogleAdsAdTrafficByKeywordsTool } from './tools/google-ads/google-ads-ad-traffic-by-keywords.tool.js';
import { BingSearchVolumeTool } from './tools/bing/bing-search-volume.tool.js';
import { BingKeywordsForSiteTool } from './tools/bing/bing-keywords-for-site.tool.js';
import { BingKeywordsForKeywordsTool } from './tools/bing/bing-keywords-for-keywords.tool.js';
import { BingKeywordPerformanceTool } from './tools/bing/bing-keyword-performance.tool.js';
import { ClickstreamSearchVolumeTool } from './tools/clickstream/clickstream-search-volume.tool.js';

export class KeywordsDataApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new GoogleAdsSearchVolumeTool(this.dataForSEOClient),
      new GoogleAdsKeywordsForSiteTool(this.dataForSEOClient),
      new GoogleAdsKeywordsForKeywordsTool(this.dataForSEOClient),
      new GoogleAdsAdTrafficByKeywordsTool(this.dataForSEOClient),
      new BingSearchVolumeTool(this.dataForSEOClient),
      new BingKeywordsForSiteTool(this.dataForSEOClient),
      new BingKeywordsForKeywordsTool(this.dataForSEOClient),
      new BingKeywordPerformanceTool(this.dataForSEOClient),
      new ClickstreamSearchVolumeTool(this.dataForSEOClient),

      new DataForSeoTrendsDemographyTool(this.dataForSEOClient),
      new DataForSeoTrendsSubregionInterestsTool(this.dataForSEOClient),
      new DataForSeoTrendsExploreTool(this.dataForSEOClient),

      new GoogleTrendsCategoriesTool(this.dataForSEOClient),
      new GoogleTrendsExploreTool(this.dataForSEOClient),
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
