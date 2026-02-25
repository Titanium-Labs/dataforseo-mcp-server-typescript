import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataGooglePlayAppReviewsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_google_play_app_reviews';
  }

  getDescription(): string {
    return 'Get Google Play app reviews with advanced options.';
  }

  getParams(): z.ZodRawShape {
    return {
      app_id: z.string().describe('Google Play package name'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      sort_by: z.string().optional().describe('Sort by newest, rating, etc.'),
      limit: z.number().optional().describe('Number of reviews to fetch'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/google/app_reviews/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
