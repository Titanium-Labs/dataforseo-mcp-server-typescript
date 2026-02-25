import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class ContentAnalysisCategoryTrendsTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'content_analysis_category_trends';
  }

  getDescription(): string {
    return 'Get category-level trends for provided content signals.';
  }

  getParams(): z.ZodRawShape {
    return {
      category_codes: z.array(z.string()).optional().describe('List of category codes to analyze'),
      date_from: z.string().optional().describe('Start date YYYY-MM-DD'),
      date_to: z.string().optional().describe('End date YYYY-MM-DD'),
      location_code: z.number().optional().describe('Location code filter'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/content_analysis/category_trends/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
