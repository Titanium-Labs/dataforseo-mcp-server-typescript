import { z } from 'zod';
import { BaseTool } from '../../../../base.tool.js';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';

export class DataForseoLabsGoogleDomainMetricsByCategoriesTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_domain_metrics_by_categories';
  }

  getDescription(): string {
    return 'Get domain metrics grouped by categories for a target domain.';
  }

  getParams(): z.ZodRawShape {
    return {
      domain: z.string().describe('Target domain'),
      category_codes: z.array(z.number()).optional().describe('Filter by category codes'),
      location_name: z.string().default('United States').describe('Location name'),
      language_code: z.string().default('en').describe('Language code'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/google/domain_metrics_by_categories/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
