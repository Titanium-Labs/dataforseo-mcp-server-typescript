import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DataForseoLabsAmazonBulkSearchVolumeTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_amazon_bulk_search_volume';
  }

  getDescription(): string {
    return 'Get Amazon search volume for multiple keywords (bulk).';
  }

  getParams(): z.ZodRawShape {
    return {
      keywords: z.array(z.string()).describe('Keywords to analyze'),
      location_name: z.string().optional().describe('Marketplace location'),
      language_code: z.string().optional().describe('Language code'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/amazon/bulk_search_volume/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
