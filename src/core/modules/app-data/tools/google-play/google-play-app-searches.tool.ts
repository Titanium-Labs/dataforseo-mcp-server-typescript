import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataGooglePlayAppSearchesTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_google_play_app_searches';
  }

  getDescription(): string {
    return 'Search Google Play apps with advanced parameters.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      category: z.string().optional().describe('Category id or name'),
      price: z.string().optional().describe('free or paid'),
      sorting: z.string().optional().describe('Sorting option'),
      limit: z.number().optional().describe('Number of apps to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/google/app_searches/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
