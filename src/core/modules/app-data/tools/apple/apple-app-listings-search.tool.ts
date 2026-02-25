import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataAppleAppListingsSearchTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_apple_app_listings_search';
  }

  getDescription(): string {
    return 'Search Apple App Store app listings (ASO) for specified keywords.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      limit: z.number().optional().describe('Number of listings to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/apple/app_listings/search/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
