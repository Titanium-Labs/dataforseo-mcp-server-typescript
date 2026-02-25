import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';
import { z } from 'zod';

export class AiOptimizationLlmResponsesPerplexityModelsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'ai_optimization_llm_responses_perplexity_models';
  }

  getDescription(): string {
    return 'List available Perplexity models.';
  }

  getParams(): z.ZodRawShape {
    return {};
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/ai_optimization/llm_responses/perplexity/models',
        'GET',
        null,
        true,
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
