import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataSocialMediaRedditTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_social_media_reddit';
  }

  getDescription(): string {
    return 'Get Reddit metrics for a subreddit or user profile.';
  }

  getParams(): z.ZodRawShape {
    return {
      target: z.string().describe('Subreddit (/r/...) or user (/u/...) identifier'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/social_media/reddit/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
