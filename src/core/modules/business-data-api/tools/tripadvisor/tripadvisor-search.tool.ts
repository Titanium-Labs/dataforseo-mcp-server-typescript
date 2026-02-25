import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataTripadvisorSearchTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_tripadvisor_search';
  }

  getDescription(): string {
    return 'Search Tripadvisor listings (hotels, restaurants, attractions) via task_post.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      location_id: z.string().optional().describe('Tripadvisor location_id to scope search'),
      category: z.string().optional().describe('Category filter: hotels, restaurants, attractions'),
      language: z.string().optional().describe('Language code, e.g. en'),
      limit: z.number().optional().describe('Max items to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/tripadvisor/search/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
