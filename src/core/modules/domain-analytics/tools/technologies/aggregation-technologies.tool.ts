import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DomainAnalyticsTechnologiesAggregationTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'domain_analytics_technologies_aggregation';
  }

  getDescription(): string {
    return 'Get aggregated metrics for technologies across domains.';
  }

  getParams(): z.ZodRawShape {
    return {
      category: z.string().optional().describe('Technology category filter'),
      location_code: z.number().optional().describe('Location code filter'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/domain_analytics/technologies/aggregation_technologies/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
