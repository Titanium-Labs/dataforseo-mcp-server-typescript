import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class ClickstreamSearchVolumeTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_clickstream_search_volume';
  }

  getDescription(): string {
    return 'Get merged clickstream search volume data (DataForSEO Trends).';
  }

  getParams(): z.ZodRawShape {
    return {
      keywords: z.array(z.string()).describe('Keywords to fetch'),
      location_name: z.string().optional().describe('Location name to filter'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/dataforseo_trends/merged_data/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
