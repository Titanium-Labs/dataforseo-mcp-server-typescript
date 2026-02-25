import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AiOptimizationLlmResponsesChatgptTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'ai_optimization_llm_responses_chatgpt';
  }

  getDescription(): string {
    return 'Get ChatGPT response snippets for provided prompts (DataForSEO AI Optimization).';
  }

  getParams(): z.ZodRawShape {
    return {
      prompt: z.string().describe('Prompt text to query'),
      model: z.string().optional().describe('Specific ChatGPT model id'),
      temperature: z.number().optional().describe('Sampling temperature'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/ai_optimization/llm_responses/chatgpt/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
