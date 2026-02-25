import { z } from 'zod';
import { BaseTool } from '../../../../base.tool.js';
import { DataForSEOClient } from '../../../../../client/dataforseo.client.js';

export class DataForseoLabsGoogleDomainWhoisOverviewTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'dataforseo_labs_google_domain_whois_overview';
  }

  getDescription(): string {
    return 'Get WHOIS overview information for a domain from DataForSEO Labs.';
  }

  getParams(): z.ZodRawShape {
    return {
      domain: z.string().describe('Target domain'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/dataforseo_labs/google/domain_whois_overview/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
