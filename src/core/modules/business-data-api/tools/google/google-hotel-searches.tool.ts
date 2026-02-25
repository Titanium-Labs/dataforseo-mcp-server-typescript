import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataGoogleHotelSearchesTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_google_hotel_searches';
  }

  getDescription(): string {
    return 'Get Google Hotel search results for specified criteria.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. city or region'),
      check_in: z.string().describe('Check-in date YYYY-MM-DD'),
      check_out: z.string().describe('Check-out date YYYY-MM-DD'),
      adults: z.number().describe('Number of adults'),
      children: z.number().optional().describe('Number of children'),
      currency: z.string().optional().describe('Currency code, e.g. USD'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/google/hotel_searches/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
