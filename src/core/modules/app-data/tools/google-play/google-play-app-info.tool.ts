import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class AppDataGooglePlayAppInfoTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'app_data_google_play_app_info';
  }

  getDescription(): string {
    return 'Get detailed info for a Google Play app.';
  }

  getParams(): z.ZodRawShape {
    return {
      app_id: z.string().describe('Google Play package name'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      country_code: z.string().optional().describe('Country code, e.g. US'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/app_data/google/app_info/live/advanced',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
