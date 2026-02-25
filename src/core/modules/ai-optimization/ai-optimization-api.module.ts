import { BaseModule, ToolDefinition } from '../base.module.js';
import { AiOptimizationLlmResponsesChatgptTool } from './tools/llm-responses/chatgpt-live.tool.js';
import { AiOptimizationLlmResponsesClaudeTool } from './tools/llm-responses/claude-live.tool.js';
import { AiOptimizationLlmResponsesGeminiTool } from './tools/llm-responses/gemini-live.tool.js';
import { AiOptimizationLlmResponsesPerplexityTool } from './tools/llm-responses/perplexity-live.tool.js';
import { AiOptimizationLlmResponsesChatgptModelsTool } from './tools/llm-responses/chatgpt-models.tool.js';
import { AiOptimizationLlmResponsesClaudeModelsTool } from './tools/llm-responses/claude-models.tool.js';
import { AiOptimizationLlmResponsesGeminiModelsTool } from './tools/llm-responses/gemini-models.tool.js';
import { AiOptimizationLlmResponsesPerplexityModelsTool } from './tools/llm-responses/perplexity-models.tool.js';
import { AiOptimizationLlmScraperChatgptTool } from './tools/llm-scraper/chatgpt-scraper-live.tool.js';
import { AiOptimizationAiKeywordDataSearchVolumeTool } from './tools/ai-keyword-data/keywords-search-volume.tool.js';
import { AiOptimizationLlmMentionsSearchTool } from './tools/llm-mentions/llm-mentions-search.tool.js';
import { AiOptimizationLlmMentionsAggregatedMetricsTool } from './tools/llm-mentions/llm-mentions-aggregated-metrics.tool.js';
import { AiOptimizationLlmMentionsCrossAggregatedTool } from './tools/llm-mentions/llm-mentions-cross-aggregated.tool.js';
import { AiOptimizationLlmMentionsTopDomainsTool } from './tools/llm-mentions/llm-mentions-top-domains.tool.js';
import { AiOptimizationLlmMentionsTopPagesTool } from './tools/llm-mentions/llm-mentions-top-pages.tool.js';
import { AiOptimizationAvailableFiltersTool } from './tools/ai-optimization-filters.tool.js';

export class AiOptimizationApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new AiOptimizationLlmResponsesChatgptTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesClaudeTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesGeminiTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesPerplexityTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesChatgptModelsTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesClaudeModelsTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesGeminiModelsTool(this.dataForSEOClient),
      new AiOptimizationLlmResponsesPerplexityModelsTool(this.dataForSEOClient),
      new AiOptimizationLlmScraperChatgptTool(this.dataForSEOClient),
      new AiOptimizationAiKeywordDataSearchVolumeTool(this.dataForSEOClient),
      new AiOptimizationLlmMentionsSearchTool(this.dataForSEOClient),
      new AiOptimizationLlmMentionsAggregatedMetricsTool(this.dataForSEOClient),
      new AiOptimizationLlmMentionsCrossAggregatedTool(this.dataForSEOClient),
      new AiOptimizationLlmMentionsTopDomainsTool(this.dataForSEOClient),
      new AiOptimizationLlmMentionsTopPagesTool(this.dataForSEOClient),
      new AiOptimizationAvailableFiltersTool(this.dataForSEOClient),
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
