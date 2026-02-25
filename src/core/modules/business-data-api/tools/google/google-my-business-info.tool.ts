import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataGoogleMyBusinessInfoTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_google_my_business_info';
  }

  getDescription(): string {
    return 'Get Google My Business profile info for the specified place_id.';
  }

  getParams(): z.ZodRawShape {
    return {
      place_id: z.string().describe('Google place_id of the business'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      location_coordinate: z.string().optional().describe('Lat,Lng to bias results'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/google/my_business_info/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
