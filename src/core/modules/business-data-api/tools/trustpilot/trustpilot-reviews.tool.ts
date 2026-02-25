import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataTrustpilotReviewsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_trustpilot_reviews';
  }

  getDescription(): string {
    return 'Fetch reviews for Trustpilot businesses (task-based).';
  }

  getParams(): z.ZodRawShape {
    return {
      business_units: z.array(z.string()).describe('Array of Trustpilot business unit IDs'),
      language: z.string().optional().describe('Language code, e.g. en'),
      sort_by: z.string().optional().describe('Sorting option, e.g. date'),
      limit: z.number().optional().describe('Max reviews to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/trustpilot/reviews/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
