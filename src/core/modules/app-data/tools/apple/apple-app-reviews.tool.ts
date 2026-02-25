import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataAppleAppReviewsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_apple_app_reviews';
  }

  getDescription(): string {
    return 'Get reviews for an Apple App Store app.';
  }

  getParams(): z.ZodRawShape {
    return {
      app_id: z.string().describe('Apple app identifier'),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      sort_by: z.string().optional().describe('Sorting option, e.g. newest, rating'),
      limit: z.number().optional().describe('Number of reviews to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/apple/app_reviews/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
