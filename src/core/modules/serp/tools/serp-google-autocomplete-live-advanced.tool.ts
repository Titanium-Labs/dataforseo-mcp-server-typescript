import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleAutocompleteLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_autocomplete_live_advanced';
  }

  getDescription(): string {
    return 'Get Google Autocomplete suggestions for a query prefix.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search prefix to get autocomplete suggestions'),
      location_name: z.string().optional().describe('Location to bias suggestions'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      type: z.string().optional().describe('Suggestion type, e.g. web, youtube, news'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/autocomplete/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
