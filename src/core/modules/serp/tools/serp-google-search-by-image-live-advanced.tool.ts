import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleSearchByImageLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_search_by_image_live_advanced';
  }

  getDescription(): string {
    return 'Run Google Search by Image (reverse image search) with a provided image URL or base64.';
  }

  getParams(): z.ZodRawShape {
    return {
      image_url: z.string().optional().describe('Publicly accessible image URL'),
      image_base64: z.string().optional().describe('Base64-encoded image content'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const body = { ...params };
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/search_by_image/live/advanced',
        'POST',
        [body],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
