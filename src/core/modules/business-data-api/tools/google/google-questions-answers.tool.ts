import { z } from 'zod';
import { BaseTool } from '../../../base.tool.js';
import { DataForSEOClient } from '../../../../client/dataforseo.client.js';

export class BusinessDataGoogleQuestionsAnswersTool extends BaseTool {
  constructor(dataForSEOClient: DataForSEOClient) {
    super(dataForSEOClient);
  }

  getName(): string {
    return 'business_data_google_questions_answers';
  }

  getDescription(): string {
    return 'Get Google Q&A (Questions and Answers) for a business location.';
  }

  getParams(): z.ZodRawShape {
    return {
      place_id: z.string().describe('Google place_id of the business'),
      language_code: z.string().optional().describe("Language code, e.g. 'en'"),
      limit: z.number().optional().describe('Number of Q&A entries to return'),
    };
  }

  async handle(params: any): Promise<any> {
    try {
      console.error(JSON.stringify(params, null, 2));
      const response = await this.dataForSEOClient.makeRequest(
        '/v3/business_data/google/questions_and_answers/live',
        'POST',
        [params],
      );
      return this.validateAndFormatResponse(response);
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}
