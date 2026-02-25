import { BaseModule, ToolDefinition } from '../base.module.js';
import { BusinessDataBusinessListingsSearchTool } from './tools/listings/business-listings-search.tool.js';
import { BusinessDataGoogleMyBusinessInfoTool } from './tools/google/google-my-business-info.tool.js';
import { BusinessDataGoogleMyBusinessUpdatesTool } from './tools/google/google-my-business-updates.tool.js';
import { BusinessDataGoogleReviewsTool } from './tools/google/google-reviews.tool.js';
import { BusinessDataGoogleQuestionsAnswersTool } from './tools/google/google-questions-answers.tool.js';
import { BusinessDataGoogleHotelSearchesTool } from './tools/google/google-hotel-searches.tool.js';
import { BusinessDataGoogleHotelInfoTool } from './tools/google/google-hotel-info.tool.js';
import { BusinessDataTrustpilotSearchTool } from './tools/trustpilot/trustpilot-search.tool.js';
import { BusinessDataTrustpilotReviewsTool } from './tools/trustpilot/trustpilot-reviews.tool.js';
import { BusinessDataTripadvisorSearchTool } from './tools/tripadvisor/tripadvisor-search.tool.js';
import { BusinessDataTripadvisorReviewsTool } from './tools/tripadvisor/tripadvisor-reviews.tool.js';
import { BusinessDataSocialMediaFacebookTool } from './tools/social-media/social-media-facebook.tool.js';
import { BusinessDataSocialMediaPinterestTool } from './tools/social-media/social-media-pinterest.tool.js';
import { BusinessDataSocialMediaRedditTool } from './tools/social-media/social-media-reddit.tool.js';
import { BusinessDataBusinessListingsCategoriesAggregationTool } from './tools/listings/business-listings-categories-aggregation.tool.js';

export class BusinessDataApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new BusinessDataBusinessListingsSearchTool(this.dataForSEOClient),
      new BusinessDataBusinessListingsCategoriesAggregationTool(this.dataForSEOClient),
      new BusinessDataGoogleMyBusinessInfoTool(this.dataForSEOClient),
      new BusinessDataGoogleMyBusinessUpdatesTool(this.dataForSEOClient),
      new BusinessDataGoogleReviewsTool(this.dataForSEOClient),
      new BusinessDataGoogleQuestionsAnswersTool(this.dataForSEOClient),
      new BusinessDataGoogleHotelSearchesTool(this.dataForSEOClient),
      new BusinessDataGoogleHotelInfoTool(this.dataForSEOClient),
      new BusinessDataTrustpilotSearchTool(this.dataForSEOClient),
      new BusinessDataTrustpilotReviewsTool(this.dataForSEOClient),
      new BusinessDataTripadvisorSearchTool(this.dataForSEOClient),
      new BusinessDataTripadvisorReviewsTool(this.dataForSEOClient),
      new BusinessDataSocialMediaFacebookTool(this.dataForSEOClient),
      new BusinessDataSocialMediaPinterestTool(this.dataForSEOClient),
      new BusinessDataSocialMediaRedditTool(this.dataForSEOClient),
      // Add more tools here
    ];

    return tools.reduce((acc, tool) => ({
      ...acc,
      [tool.getName()]: {
        description: tool.getDescription(),
        params: tool.getParams(),
        handler: (params: any) => tool.handle(params),
      },
    }), {});
  }
} 
