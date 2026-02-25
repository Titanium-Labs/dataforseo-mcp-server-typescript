import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DataForseoLabsAmazonRelatedKeywordsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_amazon_related_keywords';
  }

  getDescription(): string {
    return 'Get Amazon related keywords for seed keywords.';
  }

  getParams(): z.ZodRawShape {
    return {
      keywords: z.array(z.string()).describe('Seed keywords'),
      location_name: z.string().optional().describe('Marketplace location'),
      language_code: z.string().optional().describe('Language code'),
      limit: z.number().optional().describe('Number of results to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/amazon/related_keywords/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
