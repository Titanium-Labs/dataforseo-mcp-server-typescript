import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataSocialMediaPinterestTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_social_media_pinterest';
  }

  getDescription(): string {
    return 'Get Pinterest social media metrics for a profile or board.';
  }

  getParams(): z.ZodRawShape {
    return {
      target: z.string().describe('Pinterest profile or board URL'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/social_media/pinterest/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
