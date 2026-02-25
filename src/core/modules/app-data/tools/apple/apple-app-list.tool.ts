import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataAppleAppListTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_apple_app_list';
  }

  getDescription(): string {
    return 'Get Apple App Store app list for collections or categories.';
  }

  getParams(): z.ZodRawShape {
    return {
      collection: z.string().describe('Collection type, e.g. TOP_FREE_IOS, TOP_PAID_IOS'),
      category: z.string().optional().describe('Category id'),
      country_code: z.string().optional().describe('Country code, e.g. US'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      limit: z.number().optional().describe('Number of apps to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/apple/app_list/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
