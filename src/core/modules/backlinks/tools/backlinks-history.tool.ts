import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class BacklinksHistoryTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
  }

  getName(): string {
    return 'backlinks_history';
  }

  getDescription(): string {
    return 'Get historical backlinks data for a target domain or page.';
  }

  getParams(): z.ZodRawShape {
    return {
      target: z.string().describe('Target domain or URL'),
      mode: z.string().default('as_is').describe('Target normalization mode'),
      date_from: z.string().optional().describe('Start date YYYY-MM-DD'),
      date_to: z.string().optional().describe('End date YYYY-MM-DD'),
      limit: z.number().optional().describe('Number of records to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      const response = await this.client.makeRequest(
        '/v3/backlinks/history/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
