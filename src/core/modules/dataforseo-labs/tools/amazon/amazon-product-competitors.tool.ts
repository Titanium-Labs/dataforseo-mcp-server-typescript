import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DataForseoLabsAmazonProductCompetitorsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_amazon_product_competitors';
  }

  getDescription(): string {
    return 'Find competing products for a given Amazon ASIN.';
  }

  getParams(): z.ZodRawShape {
    return {
      asin: z.string().describe('Amazon ASIN'),
      location_name: z.string().optional().describe('Marketplace location'),
      language_code: z.string().optional().describe('Language code'),
      limit: z.number().optional().describe('Number of competitors to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/amazon/product_competitors/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
