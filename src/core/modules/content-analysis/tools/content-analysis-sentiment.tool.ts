import { z } from 'zod';
import { BaseTool } from '../../base.tool.js';
import { DataForSEOClient } from '../../../client/dataforseo.client.js';

export class ContentAnalysisSentimentTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'content_analysis_sentiment_analysis';
  }

  getDescription(): string {
    return 'Run sentiment analysis on input text or URLs.';
  }

  getParams(): z.ZodRawShape {
    return {
      text: z.string().optional().describe('Raw text to analyze'),
      url: z.string().optional().describe('URL to fetch and analyze'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/content_analysis/sentiment_analysis/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
