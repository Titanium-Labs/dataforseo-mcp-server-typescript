import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class GoogleAdsKeywordsForSiteTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_google_ads_keywords_for_site';
  }

  getDescription(): string {
    return 'Get Google Ads keyword ideas based on a website URL.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. United States'),
      language_code: z.string().describe("Language code, e.g. 'en'"),
      target: z.string().describe('Website URL to crawl for ideas'),
      page_title: z.string().optional().describe('Optional page title context'),
      max_crawl_pages: z.number().optional().describe('Max pages to crawl for ideas'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/google_ads/keywords_for_site/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
