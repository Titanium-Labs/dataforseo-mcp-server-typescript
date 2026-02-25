import { BaseModule, ToolDefinition } from '../base.module.js';
import { ContentAnalysisPhraseTrendsTool } from './tools/content-analysis-phrase-trends.js';
import { ContentAnalysisSearchTool } from './tools/content-analysis-search.tool.js';
import { ContentAnalysisSummaryTool } from './tools/content-analysis-summary.js';
import { ContentAnalysisSentimentTool } from './tools/content-analysis-sentiment.tool.js';
import { ContentAnalysisRatingDistributionTool } from './tools/content-analysis-rating-distribution.tool.js';
import { ContentAnalysisCategoryTrendsTool } from './tools/content-analysis-category-trends.tool.js';
import { ContentAnalysisCategoriesTool } from './tools/content-analysis-categories.tool.js';

export class ContentAnalysisApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new ContentAnalysisSearchTool(this.dataForSEOClient),
      new ContentAnalysisSummaryTool(this.dataForSEOClient),
      new ContentAnalysisPhraseTrendsTool(this.dataForSEOClient),
      new ContentAnalysisSentimentTool(this.dataForSEOClient),
      new ContentAnalysisRatingDistributionTool(this.dataForSEOClient),
      new ContentAnalysisCategoryTrendsTool(this.dataForSEOClient),
      new ContentAnalysisCategoriesTool(this.dataForSEOClient),
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
