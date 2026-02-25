import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DomainAnalyticsTechnologiesSummaryTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'domain_analytics_technologies_summary';
  }

  getDescription(): string {
    return 'Get summary statistics for detected technologies.';
  }

  getParams(): z.ZodRawShape {
    return {
      location_code: z.number().optional().describe('Location code filter'),
      category: z.string().optional().describe('Technology category filter'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/domain_analytics/technologies/technologies_summary/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
