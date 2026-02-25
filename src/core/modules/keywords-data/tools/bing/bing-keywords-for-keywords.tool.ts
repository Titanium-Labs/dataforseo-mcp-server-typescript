import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BingKeywordsForKeywordsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'keywords_data_bing_keywords_for_keywords';
  }

  getDescription(): string {
    return 'Generate related keywords from Bing using seed keywords.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_name: z.string().describe('Location name, e.g. United States'),
      language_code: z.string().describe("Language code, e.g. 'en'"),
      keywords: z.array(z.string()).describe('Seed keywords'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/keywords_data/bing/keywords_for_keywords/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
