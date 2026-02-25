import { z } from 'zod';
import { BaseTool } from '../../../../base.tool.js';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';

export class DataForseoLabsGoogleRelevantPagesTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_relevant_pages';
  }

  getDescription(): string {
    return 'Find relevant pages for a domain within search results.';
  }

  getParams(): z.ZodRawShape {
    return {
      domain: z.string().describe('Target domain'),
      location_name: z.string().default('United States').describe('Location name'),
      language_code: z.string().default('en').describe('Language code'),
      limit: z.number().optional().describe('Number of pages to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/google/relevant_pages/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
