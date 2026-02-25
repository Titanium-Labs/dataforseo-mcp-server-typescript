import { BaseModule, ToolDefinition } from '../base.module.js';
import { z } from 'zod';
import { SerpOrganicLiveAdvancedTool } from './tools/serp-organic-live-advanced.tool.js';
import { SerpOrganicLocationsListTool } from './tools/serp-organic-locations-list.tool.js';
import { SerpYoutubeOrganicLiveAdvancedTool } from './tools/serp-youtube-organic-live-advanced.tool.js';
import { SerpYoutubeVideoInfoLiveAdvancedTool } from './tools/serp-youtube-video-info-live-advanced.tool.js';
import { SerpYoutubeVideoCommentsLiveAdvancedTool } from './tools/serp-youtube-video-comments-live-advanced-tool.js';
import { SerpYoutubeVideoSubtitlesLiveAdvancedTool } from './tools/serp-youtube-video-subtitles-live-advanced-tool.js';
import { SerpYoutubeLocationsListTool } from './tools/serp-youtube-locations-list.tool.js';
import { SerpGoogleMapsLiveAdvancedTool } from './tools/serp-google-maps-live-advanced.tool.js';
import { SerpGoogleLocalFinderLiveAdvancedTool } from './tools/serp-google-local-finder-live-advanced.tool.js';
import { SerpGoogleNewsLiveAdvancedTool } from './tools/serp-google-news-live-advanced.tool.js';
import { SerpGoogleImagesLiveAdvancedTool } from './tools/serp-google-images-live-advanced.tool.js';
import { SerpGoogleSearchByImageLiveAdvancedTool } from './tools/serp-google-search-by-image-live-advanced.tool.js';
import { SerpGoogleJobsLiveAdvancedTool } from './tools/serp-google-jobs-live-advanced.tool.js';
import { SerpGoogleEventsLiveAdvancedTool } from './tools/serp-google-events-live-advanced.tool.js';
import { SerpGoogleAutocompleteLiveAdvancedTool } from './tools/serp-google-autocomplete-live-advanced.tool.js';
import { SerpGoogleAiModeLiveAdvancedTool } from './tools/serp-google-ai-mode-live-advanced.tool.js';
import { SerpGoogleDatasetSearchLiveAdvancedTool } from './tools/serp-google-dataset-search-live-advanced.tool.js';
import { SerpGoogleAdsSearchLiveAdvancedTool } from './tools/serp-google-ads-search-live-advanced.tool.js';
import { SerpBaiduOrganicLiveAdvancedTool } from './tools/serp-baidu-organic-live-advanced.tool.js';
import { SerpNaverOrganicLiveAdvancedTool } from './tools/serp-naver-organic-live-advanced.tool.js';
import { SerpScreenshotTool } from './tools/serp-screenshot.tool.js';
import { SerpAiSummaryTool } from './tools/serp-ai-summary.tool.js';

export class SerpApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new SerpOrganicLiveAdvancedTool(this.dataForSEOClient),
      new SerpOrganicLocationsListTool(this.dataForSEOClient),

      new SerpYoutubeLocationsListTool(this.dataForSEOClient),
      new SerpYoutubeOrganicLiveAdvancedTool(this.dataForSEOClient),
      new SerpYoutubeVideoInfoLiveAdvancedTool(this.dataForSEOClient),
      new SerpYoutubeVideoCommentsLiveAdvancedTool(this.dataForSEOClient),
      new SerpYoutubeVideoSubtitlesLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleMapsLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleLocalFinderLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleNewsLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleImagesLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleSearchByImageLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleJobsLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleEventsLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleAutocompleteLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleAiModeLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleDatasetSearchLiveAdvancedTool(this.dataForSEOClient),
      new SerpGoogleAdsSearchLiveAdvancedTool(this.dataForSEOClient),
      new SerpBaiduOrganicLiveAdvancedTool(this.dataForSEOClient),
      new SerpNaverOrganicLiveAdvancedTool(this.dataForSEOClient),
      new SerpScreenshotTool(this.dataForSEOClient),
      new SerpAiSummaryTool(this.dataForSEOClient),
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
