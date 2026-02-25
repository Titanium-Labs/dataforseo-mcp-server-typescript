import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class GoogleAdsKeywordsForKeywordsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_google_ads_keywords_for_keywords';
  }

  getDescription(): string {
    return 'Generate related keyword ideas from seed keywords using Google Ads.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. United States'),
      language_code: z.string().describe("Language code, e.g. 'en'"),
      keywords: z.array(z.string()).describe('Seed keywords'),
      include_seed_keywords: z.boolean().optional().describe('Include seed keywords in results'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/google_ads/keywords_for_keywords/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
