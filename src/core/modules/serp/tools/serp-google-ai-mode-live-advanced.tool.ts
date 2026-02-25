import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleAiModeLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_ai_mode_live_advanced';
  }

  getDescription(): string {
    return 'Get Google AI overview / AI mode SERP results for a query.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword or question'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/ai_mode/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
