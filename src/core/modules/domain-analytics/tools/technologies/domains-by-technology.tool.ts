import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DomainAnalyticsTechnologiesDomainsByTechnologyTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'domain_analytics_technologies_domains_by_technology';
  }

  getDescription(): string {
    return 'List domains that use a specified technology.';
  }

  getParams(): z.ZodRawShape {
    return {
      technology: z.string().describe('Technology name or id'),
      limit: z.number().optional().describe('Number of domains to return'),
      offset: z.number().optional().describe('Offset for pagination'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/domain_analytics/technologies/domains_by_technology/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
