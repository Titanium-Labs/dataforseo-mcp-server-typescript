import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BingKeywordPerformanceTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_bing_keyword_performance';
  }

  getDescription(): string {
    return 'Get performance metrics for specified Bing keywords.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. United States'),
      language_code: z.string().describe("Language code, e.g. 'en'"),
      keywords: z.array(z.string()).describe('Keywords to analyze'),
      date_from: z.string().optional().describe('Start date YYYY-MM-DD'),
      date_to: z.string().optional().describe('End date YYYY-MM-DD'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/bing/keyword_performance/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
