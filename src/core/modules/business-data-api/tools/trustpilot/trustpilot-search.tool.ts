import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataTrustpilotSearchTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_trustpilot_search';
  }

  getDescription(): string {
    return 'Search Trustpilot businesses and fetch company profiles (task-based).';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Business name or keyword to search'),
      country: z.string().optional().describe('Country filter, ISO 2-letter'),
      language: z.string().optional().describe('Language code, e.g. en'),
      limit: z.number().optional().describe('Max results to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/trustpilot/search/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
