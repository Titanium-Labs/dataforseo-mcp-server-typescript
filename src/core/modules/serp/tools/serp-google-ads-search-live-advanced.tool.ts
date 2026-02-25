import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleAdsSearchLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_ads_search_live_advanced';
  }

  getDescription(): string {
    return 'Get Google Ads search results (sponsored listings) for a keyword.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      device: z.string().optional().describe('device type, desktop or mobile'),
      os: z.string().optional().describe('operating system, e.g. windows, macos, android, ios'),
      depth: z.number().optional().describe('parsing depth, number of results to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/ads_search/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
