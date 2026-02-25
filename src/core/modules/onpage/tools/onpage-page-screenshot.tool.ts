import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPagePageScreenshotTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_page_screenshot';
  }

  getDescription(): string {
    return 'Capture a screenshot of a page with OnPage renderer.';
  }

  getParams(): z.ZodRawShape {
    return {
      url: z.string().describe('Target page URL'),
      enable_javascript: z.boolean().optional().describe('Render JavaScript before capture'),
      custom_js: z.string().optional().describe('Custom JavaScript to execute'),
      custom_user_agent: z.string().optional().describe('Custom User-Agent header'),
      accept_language: z.string().optional().describe('Accept-Language header'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/on_page/page_screenshot',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
