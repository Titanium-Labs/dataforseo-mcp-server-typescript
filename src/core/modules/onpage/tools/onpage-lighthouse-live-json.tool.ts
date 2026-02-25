import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class OnPageLighthouseLiveJsonTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'on_page_lighthouse_live_json';
  }

  getDescription(): string {
    return 'Run Lighthouse analysis live and return JSON results.';
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
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/on_page/lighthouse/live/json',
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
