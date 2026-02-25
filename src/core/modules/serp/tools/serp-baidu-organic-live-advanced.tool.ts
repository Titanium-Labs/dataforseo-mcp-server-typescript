import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpBaiduOrganicLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_baidu_organic_live_advanced';
  }

  getDescription(): string {
    return 'Get Baidu organic search results for a keyword.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search keyword'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().optional().describe("language code (e.g., 'zh')"),
      depth: z.number().optional().describe('parsing depth, number of results to return'),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/baidu/organic/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
