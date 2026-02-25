import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPageTaskPostTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_task_post';
  }

  getDescription(): string {
    return 'Create a new OnPage crawl task for a target URL or domain.';
  }

  getParams(): z.ZodRawShape {
    return {
      target: z.string().describe('URL or domain to crawl'),
      max_crawl_pages: z.number().optional().describe('Maximum pages to crawl'),
      crawl_depth: z.number().optional().describe('Maximum crawl depth'),
      custom_user_agent: z.string().optional().describe('Custom User-Agent header'),
      accept_language: z.string().optional().describe('Accept-Language header'),
      enable_javascript: z.boolean().optional().describe('Render JavaScript during crawl'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/on_page/task_post',
        'POST',
        [params],
        true,
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
