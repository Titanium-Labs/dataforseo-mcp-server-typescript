import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataGoogleMyBusinessUpdatesTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_google_my_business_updates';
  }

  getDescription(): string {
    return 'Get recent Google My Business updates for specified business locations.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_ids: z.array(z.string()).describe('Array of Google location IDs'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      limit: z.number().optional().describe('Number of updates to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/google/my_business_updates/task_post',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
