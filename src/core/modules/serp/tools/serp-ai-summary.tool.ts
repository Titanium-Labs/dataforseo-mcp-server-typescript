import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpAiSummaryTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_ai_summary';
  }

  getDescription(): string {
    return 'Generate an AI summary for SERP results based on a keyword.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword to summarize SERP for'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().optional().describe("language code (e.g., 'en')"),
      search_engine: z.string().default('google').describe('Search engine, e.g. google'),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/ai_summary',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
