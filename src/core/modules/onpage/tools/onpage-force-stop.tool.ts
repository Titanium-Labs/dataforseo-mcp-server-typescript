import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPageForceStopTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_force_stop';
  }

  getDescription(): string {
    return 'Force-stop an active OnPage crawl task.';
  }

  protected supportOnlyFullResponse(): boolean {
    return true;
  }

  getParams(): z.ZodRawShape {
    return {
      task_id: z.string().describe('Task ID to stop'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/on_page/force_stop',
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
