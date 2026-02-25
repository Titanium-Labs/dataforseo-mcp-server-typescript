import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class DomainAnalyticsTechnologiesDomainsByHtmlTermsTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'domain_analytics_technologies_domains_by_html_terms';
  }

  getDescription(): string {
    return 'Find domains by HTML terms or snippets detected.';
  }

  getParams(): z.ZodRawShape {
    return {
      html_terms: z.array(z.string()).describe('HTML terms to search for'),
      limit: z.number().optional().describe('Number of domains to return'),
      offset: z.number().optional().describe('Offset for pagination'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/domain_analytics/technologies/domains_by_html_terms/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
