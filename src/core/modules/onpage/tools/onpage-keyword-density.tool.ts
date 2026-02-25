import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPageKeywordDensityTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_keyword_density';
  }

  getDescription(): string {
    return 'Get keyword density statistics for pages in an OnPage crawl.';
  }

  protected supportOnlyFullResponse(): boolean {
    return true;
  }

  getParams(): z.ZodRawShape {
    return {
      task_id: z.string().describe('Task ID returned from on_page_task_post'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        `/v3/on_page/keyword_density/${params.task_id}`,
        'GET',
        null,
        true,
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
