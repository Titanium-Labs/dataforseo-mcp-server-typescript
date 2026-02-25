import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DataForseoLabsAmazonRankedKeywordsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_amazon_ranked_keywords';
  }

  getDescription(): string {
    return 'Get keywords a product is ranked for on Amazon.';
  }

  getParams(): z.ZodRawShape {
    return {
      asin: z.string().describe('Amazon ASIN'),
      location_name: z.string().optional().describe('Marketplace location'),
      language_code: z.string().optional().describe('Language code'),
      limit: z.number().optional().describe('Number of keywords to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/amazon/ranked_keywords/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
