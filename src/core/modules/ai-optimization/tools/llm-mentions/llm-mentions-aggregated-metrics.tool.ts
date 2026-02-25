import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AiOptimizationLlmMentionsAggregatedMetricsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'ai_optimization_llm_mentions_aggregated_metrics';
  }

  getDescription(): string {
    return 'Get aggregated metrics for LLM mentions (volume, sentiment, etc.).';
  }

  getParams(): z.ZodRawShape {
    return {
      query: z.string().describe('Search query'),
      date_from: z.string().optional().describe('Start date YYYY-MM-DD'),
      date_to: z.string().optional().describe('End date YYYY-MM-DD'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/ai_optimization/llm_mentions/aggregated_metrics/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
