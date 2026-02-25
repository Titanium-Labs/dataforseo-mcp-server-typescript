import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class SerpScreenshotTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'serp_screenshot';
  }

  getDescription(): string {
    return 'Take a screenshot of a target URL using the SERP screenshot utility.';
  }

  getParams(): z.ZodRawShape {
    return {
      url: z.string().url().describe('Target page URL to capture'),
      custom_js: z.string().optional().describe('Optional JavaScript to execute before capture'),
      load_type: z.string().optional().describe('Page load type, e.g. html or screenshot'),
      device: z.string().optional().describe('device type, desktop or mobile'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/serp/screenshot',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
