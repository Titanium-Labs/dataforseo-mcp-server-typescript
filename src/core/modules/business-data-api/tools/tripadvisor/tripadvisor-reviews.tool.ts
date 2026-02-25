import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataTripadvisorReviewsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_tripadvisor_reviews';
  }

  getDescription(): string {
    return 'Fetch Tripadvisor reviews for specified listing IDs (task-based).';
  }

  getParams(): z.ZodRawShape {
    return {
      listing_ids: z.array(z.string()).describe('Array of Tripadvisor listing IDs'),
      language: z.string().optional().describe('Language code, e.g. en'),
      sort_by: z.string().optional().describe('Sorting option, e.g. date'),
      limit: z.number().optional().describe('Max reviews to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/tripadvisor/reviews/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
