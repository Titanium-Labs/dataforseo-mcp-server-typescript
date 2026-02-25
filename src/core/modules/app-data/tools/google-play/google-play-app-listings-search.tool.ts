import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataGooglePlayAppListingsSearchTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_google_play_app_listings_search';
  }

  getDescription(): string {
    return 'Search Google Play app listings (ASO) for specified keywords.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      limit: z.number().optional().describe('Number of listings to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/google/app_listings/search/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
