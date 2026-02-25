import { z } from 'zod';
import { BaseTool } from '../../../../base.tool.js';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';

export class DataForseoLabsGoogleKeywordsForCategoriesTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_keywords_for_categories';
  }

  getDescription(): string {
    return 'Get keyword ideas associated with specified category codes.';
  }

  getParams(): z.ZodRawShape {
    return {
      category_codes: z.array(z.number()).describe('Category codes to expand'),
      location_name: z.string().default('United States').describe('Location name'),
      language_code: z.string().default('en').describe('Language code'),
      limit: z.number().optional().describe('Number of keywords to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/google/keywords_for_categories/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
