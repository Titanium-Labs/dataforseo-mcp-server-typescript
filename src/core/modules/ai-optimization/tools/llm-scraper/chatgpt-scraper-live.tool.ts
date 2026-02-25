import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AiOptimizationLlmScraperChatgptTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'ai_optimization_llm_scraper_chatgpt';
  }

  getDescription(): string {
    return 'Scrape content using ChatGPT browser mode (advanced).';
  }

  getParams(): z.ZodRawShape {
    return {
      url: z.string().describe('Target URL to scrape'),
      prompt: z.string().optional().describe('Prompt or instructions for extraction'),
      viewport: z.string().optional().describe('Viewport preset'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/ai_optimization/llm_scraper/chatgpt/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
