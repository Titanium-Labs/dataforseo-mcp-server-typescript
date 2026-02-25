import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPageLighthouseTaskPostTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_lighthouse_task_post';
  }

  getDescription(): string {
    return 'Create a Lighthouse audit task (async) for later retrieval.';
  }

  protected supportOnlyFullResponse(): boolean {
    return true;
  }

  getParams(): z.ZodRawShape {
    return {
      url: z.string().describe('Target page URL'),
      strategy: z.string().optional().describe('Device strategy: desktop or mobile'),
      emulate_device: z.boolean().optional().describe('Whether to emulate device settings'),
      locale: z.string().optional().describe('Locale for Lighthouse'),
      pingback_url: z.string().url().optional().describe('Optional callback URL'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/on_page/lighthouse/task_post',
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
