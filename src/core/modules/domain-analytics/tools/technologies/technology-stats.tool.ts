import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DomainAnalyticsTechnologiesTechnologyStatsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'domain_analytics_technologies_technology_stats';
  }

  getDescription(): string {
    return 'Get stats for a specific technology across domains.';
  }

  getParams(): z.ZodRawShape {
    return {
      technology: z.string().describe('Technology name or id'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/domain_analytics/technologies/technology_stats/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
