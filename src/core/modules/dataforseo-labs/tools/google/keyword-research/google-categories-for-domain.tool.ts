import { z } from 'zod';
import { BaseTool } from '../../../../base.tool.js';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';

export class DataForseoLabsGoogleCategoriesForDomainTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_categories_for_domain';
  }

  getDescription(): string {
    return 'Get category relevance metrics for a given domain.';
  }

  getParams(): z.ZodRawShape {
    return {
      domain: z.string().describe('Target domain'),
      location_name: z.string().default('United States').describe('Location name'),
      language_code: z.string().default('en').describe('Language code'),
      limit: z.number().optional().describe('Number of categories to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/google/categories_for_domain/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
