import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpGoogleLocalFinderLiveAdvancedTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_google_local_finder_live_advanced';
  }

  getDescription(): string {
    return 'Get Google Local Finder results (3-pack expansion) for a query.';
  }

  getParams(): z.ZodRawShape {
    return {
      keyword: z.string().describe('Search term for local intent'),
      location_name: z.string().describe(`full name of the location
required field
Location format - hierarchical, comma-separated (from most specific to least)
 1. Country only: "United States"
 2. Region,Country: "California,United States"
 3. City,Region,Country: "San Francisco,California,United States"`),
      language_code: z.string().describe("search engine language code (e.g., 'en')"),
      device: z.string().optional().describe('device type, desktop or mobile'),
      depth: z.number().optional().describe('parsing depth, number of results to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/google/local_finder/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
