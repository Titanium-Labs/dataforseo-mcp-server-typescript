import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleEventsLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_events_live_advanced';
  }

  getDescription(): string {
    return 'Get Google Events SERP results for a query.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Events search keyword'),
      location_name: z.string().optional().describe('Location to bias results'),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      date_from: z.string().optional().describe('Filter events starting after this date (YYYY-MM-DD)'),
      date_to: z.string().optional().describe('Filter events starting before this date (YYYY-MM-DD)'),
      device: z.string().optional().describe('device type, desktop or mobile'),
      depth: z.number().optional().describe('parsing depth, number of results to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/events/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
