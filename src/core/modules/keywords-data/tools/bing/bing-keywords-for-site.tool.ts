import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BingKeywordsForSiteTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_bing_keywords_for_site';
  }

  getDescription(): string {
    return 'Get keyword ideas from Bing based on a website URL.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. United States'),
      language_code: z.string().describe("Language code, e.g. 'en'"),
      target: z.string().describe('Website URL to analyze'),
      max_crawl_pages: z.number().optional().describe('Max pages to crawl for ideas'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/bing/keywords_for_site/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
