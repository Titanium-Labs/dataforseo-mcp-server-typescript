import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleImagesLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_images_live_advanced';
  }

  getDescription(): string {
    return 'Get Google Images search results for a keyword.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Image search keyword'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      device: z.string().optional().describe('device type, desktop or mobile'),
      depth: z.number().optional().describe('parsing depth, number of results to return'),
      safe_search: z.string().optional().describe('Safe search setting: off, moderate, strict'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/images/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
