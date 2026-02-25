import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DataForseoLabsAmazonProductKeywordIntersectionsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_amazon_product_keyword_intersections';
  }

  getDescription(): string {
    return 'Find keyword intersections between multiple Amazon products.';
  }

  getParams(): z.ZodRawShape {
    return {
      asins: z.array(z.string()).describe('List of ASINs to compare'),
      location_name: z.string().optional().describe('Marketplace location'),
      language_code: z.string().optional().describe('Language code'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/amazon/product_keyword_intersections/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
