import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataGoogleReviewsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_google_reviews';
  }

  getDescription(): string {
    return 'Get Google reviews for specified places (task-based).';
  }

  getParams(): z.ZodRawShape {
    return {
      place_ids: z.array(z.string()).describe('Array of Google place_ids'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      sort_by: z.string().optional().describe('Sorting option, e.g. date'),
      limit: z.number().optional().describe('Max number of reviews to fetch'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/google/reviews/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
