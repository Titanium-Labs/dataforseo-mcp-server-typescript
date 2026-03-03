# DataForSEO MCP Server

Model Context Protocol (MCP) server implementation for DataForSEO, enabling AI assistants to interact with selected DataForSEO APIs and obtain SEO data through a standardized interface. 

## Features

- **SERP API**: real-time Search Engine Results Page (SERP) data for Google, Bing, and Yahoo;
- **KEYWORDS_DATA API**: keyword research and clickstream data, including search volume, cost-per-click, and other metrics;   
- **ONPAGE API**: allows crawling websites and webpages according to customizable parameters to obtain on-page SEO performance metrics; 
- **DATAFORSEO LABS API**: data on keywords, SERPs, and domains based on DataForSEO's in-house databases and proprietary algorithms;
- **BACKLINKS API**: comprehensive backlink analysis including referring domains, anchor text distribution, and link quality metrics;
- **BUSINESS DATA API**: publicly available data on any business entity;
- **DOMAIN ANALYTICS API**: data on website traffic, technologies, and Whois details;
- **CONTENT ANALYSIS API**: robust source of data for brand monitoring, sentiment analysis, and citation management;
- **AI OPTIMIZATION API**: AI responses, mentions, keyword data, and scraper utilities for LLM-focused workflows;
- **APP DATA API**: app store data for Google Play and Apple, including search, listings, reviews, and categories;

## Prerequisites

- Node.js (v14 or higher)
- DataForSEO API credentials (API login and password)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dataforseo/mcp-server-typescript
cd mcp-server-typescript
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Required
export DATAFORSEO_USERNAME=your_username
export DATAFORSEO_PASSWORD=your_password

# Optional: specify which modules to enable (comma-separated)
# If not set, all modules will be enabled
export ENABLED_MODULES="SERP,KEYWORDS_DATA,ONPAGE,DATAFORSEO_LABS,BACKLINKS,BUSINESS_DATA,DOMAIN_ANALYTICS,CONTENT_ANALYSIS,AI_OPTIMIZATION,APP_DATA"

# Optional: supply secrets via files (recommended for CI/Docker/K8s secrets)
# export DATAFORSEO_USERNAME_FILE=/run/secrets/dfs_user
# export DATAFORSEO_PASSWORD_FILE=/run/secrets/dfs_pass

# Optional: enable full API responses
# If not set or set to false, the server will filter and transform API responses to a more concise format
# If set to true, the server will return the full, unmodified API responses
export DATAFORSEO_FULL_RESPONSE="false"
```

## Installation as an NPM Package

You can install the package globally:

```bash
npm install -g dataforseo-mcp-server
```

Or run it directly without installation:

```bash
npx dataforseo-mcp-server
```

Remember to set environment variables before running the command:

```bash
# Required environment variables
export DATAFORSEO_USERNAME=your_username
export DATAFORSEO_PASSWORD=your_password

# Run with npx
npx dataforseo-mcp-server
```

## Building and Running

Build the project:
```bash
npm run build
```

Run the server:
```bash
# Start local server (direct MCP communication)
npx dataforseo-mcp-server

# Start HTTP server
npx dataforseo-mcp-server http
```

## HTTP Server Configuration

The server runs on port 3000 by default and supports both Basic Authentication and environment variable-based authentication.

To start the HTTP server, run:
```bash
npm run http
```

### Authentication Methods

1. **Basic Authentication**
   - Send requests with Basic Auth header:
   ```
   Authorization: Basic <base64-encoded-credentials>
   ```
   - Credentials format: `username:password`

2. **Environment Variables**
   - If no Basic Auth is provided, the server will use credentials from environment variables:
   ```bash
   export DATAFORSEO_USERNAME=your_username
   export DATAFORSEO_PASSWORD=your_password
   ```

## Cloudflare Worker Deployment

The DataForSEO MCP Server can be deployed as a Cloudflare Worker for serverless, edge-distributed access to DataForSEO APIs.

### Worker Features

- **Edge Distribution**: Deploy globally across Cloudflare's edge network
- **Serverless**: No server management required
- **Auto-scaling**: Handles traffic spikes automatically
- **MCP Protocol Support**: Compatible with both Streamable HTTP and SSE transports
- **Environment Variables**: Secure credential management through Cloudflare dashboard

### Quick Start

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Configure Worker**:
   ```bash
   # Login to Cloudflare
   wrangler login
   
   # Set environment variables
   wrangler secret put DATAFORSEO_USERNAME
   wrangler secret put DATAFORSEO_PASSWORD
   ```

3. **Deploy Worker**:
   ```bash
   # Build and deploy
   npm run build
   wrangler deploy --main build/index-worker.js
   ```

### Configuration

The worker uses the same environment variables as the standard server:

- `DATAFORSEO_USERNAME`: Your DataForSEO username
- `DATAFORSEO_PASSWORD`: Your DataForSEO password  
- `ENABLED_MODULES`: Comma-separated list of modules to enable
- `DATAFORSEO_FULL_RESPONSE`: Set to "true" for full API responses

### Worker Endpoints

Once deployed, your worker will be available at `https://your-worker.your-subdomain.workers.dev/` with the following endpoints:

- **POST /mcp**: Streamable HTTP transport (recommended)
- **GET /sse**: SSE connection establishment (deprecated)
- **POST /messages**: SSE message handling (deprecated)
- **GET /health**: Health check endpoint
- **GET /**: API documentation page

### Advanced Configuration

Edit `wrangler.jsonc` to customize your deployment:

```jsonc
{
  "name": "dataforseo-mcp-worker",
  "main": "build/index-worker.js",
  "compatibility_date": "2025-07-10",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "ENABLED_MODULES": "SERP,KEYWORDS_DATA,ONPAGE,DATAFORSEO_LABS"
  }
}
```

### Usage with Claude

After deployment, configure Claude to use your worker:

```json
{
  "name": "DataForSEO",
  "description": "Access DataForSEO APIs via Cloudflare Worker",
  "transport": {
    "type": "http",
    "baseUrl": "https://your-worker.your-subdomain.workers.dev/mcp"
  }
}
```
   
## Available Modules

The following modules are available to be enabled/disabled:

- `SERP`: real-time SERP data for Google, Bing, and Yahoo;
- `KEYWORDS_DATA`: keyword research and clickstream data;
- `ONPAGE`: crawl websites and webpages to obtain on-page SEO performance metrics;
- `DATAFORSEO_LABS`: data on keywords, SERPs, and domains based on DataForSEO's databases and algorithms;
- `BACKLINKS`: data on inbound links, referring domains and referring pages for any domain, subdomain, or webpage;
- `BUSINESS_DATA`: based on business reviews and business information publicly shared on the following platforms: Google, Trustpilot, Tripadvisor;
- `DOMAIN_ANALYTICS`: helps identify all possible technologies used for building websites and offers Whois data;
- `CONTENT_ANALYSIS`: help you discover citations of the target keyword or brand and analyze the sentiments around it;

## Adding New Tools/Modules

### Module Structure

Each module corresponds to a specific DataForSEO API:
- `SERP` module → [SERP API](https://docs.dataforseo.com/v3/serp/overview)
- `KEYWORDS_DATA` module → [Keywords Data API](https://docs.dataforseo.com/v3/keywords_data/overview)
- `ONPAGE` module → [OnPage API](https://docs.dataforseo.com/v3/on_page/overview)
- `DATAFORSEO_LABS` module → [DataForSEO Labs API](https://docs.dataforseo.com/v3/dataforseo_labs/overview)
- `BACKLINKS`: module → [Backlinks API](https://docs.dataforseo.com/v3/backlinks/overview)
- `BUSINESS_DATA`: module → [Business Data API](https://docs.dataforseo.com/v3/business_data/overview)
- `DOMAIN_ANALYTICS`: module → [Domain Analytics API](https://docs.dataforseo.com/v3/domain_analytics/overview)
- `CONTENT_ANALYSIS`: module → [Content Analysis API](https://docs.dataforseo.com/v3/content_analysis/overview)

### Implementation Options

You can either:
1. Add a new tool to an existing module
2. Create a completely new module

### Adding a New Tool

Here's how to add a new tool to any new or pre-existing module:

```typescript
// src/code/modules/your-module/tools/your-tool.tool.ts
import { BaseTool } from '../../base.tool';
import { DataForSEOClient } from '../../../client/dataforseo.client';
import { z } from 'zod';

export class YourTool extends BaseTool {
  constructor(private client: DataForSEOClient) {
    super(client);
    // DataForSEO API returns extensive data with many fields, which can be overwhelming
    // for AI agents to process. We select only the most relevant fields to ensure
    // efficient and focused responses.
    this.fields = [
      'title',           // Example: Include the title field
      'description',     // Example: Include the description field
      'url',            // Example: Include the URL field
      // Add more fields as needed
    ];
  }

  getName() {
    return 'your-tool-name';
  }

  getDescription() {
    return 'Description of what your tool does';
  }

  getParams(): z.ZodRawShape {
    return {
      // Required parameters
      keyword: z.string().describe('The keyword to search for'),
      location: z.string().describe('Location in format "City,Region,Country" or just "Country"'),
      
      // Optional parameters
      fields: z.array(z.string()).optional().describe('Specific fields to return in the response. If not specified, all fields will be returned'),
      language: z.string().optional().describe('Language code (e.g., "en")'),
    };
  }

  async handle(params: any) {
    try {
      // Make the API call
      const response = await this.client.makeRequest({
        endpoint: '/v3/dataforseo_endpoint_path',
        method: 'POST',
        body: [{
          // Your request parameters
          keyword: params.keyword,
          location: params.location,
          language: params.language,
        }],
      });

      // Validate the response for errors
      this.validateResponse(response);

      //if the main data array is specified in tasks[0].result[:] field
      const result = this.handleDirectResult(response);
      //if main data array specified in tasks[0].result[0].items field
      const result = this.handleItemsResult(response);
      // Format and return the response
      return this.formatResponse(result);
    } catch (error) {
      // Handle and format any errors
      return this.formatErrorResponse(error);
    }
  }
}
```

### Creating a New Module

1. Create a new directory under `src/core/modules/` for your module:
```bash
mkdir -p src/core/modules/your-module-name
```

2. Create module files:
```typescript
// src/core/modules/your-module-name/your-module-name.module.ts
import { BaseModule } from '../base.module';
import { DataForSEOClient } from '../../client/dataforseo.client';
import { YourTool } from './tools/your-tool.tool';

export class YourModuleNameModule extends BaseModule {
  constructor(private client: DataForSEOClient) {
    super();
  }

  getTools() {
    return {
      'your-tool-name': new YourTool(this.client),
    };
  }
}
```

3. Register your module in `src/core/config/modules.config.ts`:
```typescript
export const AVAILABLE_MODULES = [
  'SERP',
  'KEYWORDS_DATA',
  'ONPAGE',
  'DATAFORSEO_LABS',
  'BACKLINKS',
  'BUSINESS_DATA',
  'DOMAIN_ANALYTICS',
  'CONTENT_ANALYSIS',
  'YOUR_MODULE_NAME'  // Add your module name here
] as const;
```

4. Initialize your module in `src/main/index.ts`:
```typescript
if (isModuleEnabled('YOUR_MODULE_NAME', enabledModules)) {
  modules.push(new YourModuleNameModule(dataForSEOClient));
}
```

## Field Configuration

The MCP server supports field filtering to customize which data fields are returned in API responses. This helps reduce response size and focus on the most relevant data for your use case.

### Configuration File Format

Create a JSON configuration file with the following structure:

```json
{
  "supported_fields": {
    "tool_name": ["field1", "field2", "field3"],
    "another_tool": ["field1", "field2"]
  }
}
```

### Using Field Configuration

Pass the configuration file using the `--configuration` parameter:

```bash
# With npm
npm run cli -- http --configuration field-config.json

# With npx
npx dataforseo-mcp-server http --configuration field-config.json

# Local mode
npx dataforseo-mcp-server local --configuration field-config.json
```

### Configuration Behavior

- **If a tool is configured**: Only the specified fields will be returned in the response
- **If a tool is not configured**: All available fields will be returned (default behavior)
- **If no configuration file is provided**: All tools return all available fields

### Example Configuration File

The repository includes an example configuration file `field-config.example.json` with optimized field selections for common tools:

```json
{
  "supported_fields": {
    "backlinks_backlinks": [
      "id",
      "items.anchor",
      "items.backlink_spam_score",
      "items.dofollow",
      "items.domain_from",
      "items.domain_from_country",
      "items.domain_from_ip",
      "items.domain_from_platform_type",
      "items.domain_from_rank",
      "items.domain_to",
      "items.first_seen",
      "items.is_broken",
      "items.is_new",
      "items.item_type",
      "items.last_seen",
      "items.links_count",
      "items.original",
      "items.page_from_encoding",
      "items.page_from_external_links",
      "items.page_from_internal_links",
      "items.page_from_language",
      "items.page_from_rank",
      "items.page_from_size",
      "items.page_from_status_code",
      "items.page_from_title",
      "items.prev_seen",
      "items.rank",
      "items.ranked_keywords_info.page_from_keywords_count_top_10",
      "items.ranked_keywords_info.page_from_keywords_count_top_100",
      "items.ranked_keywords_info.page_from_keywords_count_top_3",
      "items.semantic_location",
      "items.text_post",
      "items.text_pre",
      "items.tld_from",
      "items.type",
      "items.url_from",
      "items.url_from_https",
      "items.url_to",
      "items.url_to_https",
      "items.url_to_spam_score",
      "items.url_to_status_code",
      "status_code",
      "status_message"
    ],
    ...
  }
}
```

### Nested Field Support

The configuration supports nested field paths using dot notation:

- `"rating.value"` - Access the `value` field within the `rating` object
- `"items.demography.age.keyword"` - Access deeply nested fields
- `"meta.description"` - Access nested object properties

### Field Discovery

To discover available fields for any tool:

1. Run the tool without field configuration to see the full response
2. Identify the fields you need from the API response
3. Add those field paths to your configuration file

### Creating Your Own Configuration

1. Copy the example file:
```bash
cp field-config.example.json my-config.json
```

2. Modify the field selections based on your needs

3. Use your custom configuration:
```bash
npx dataforseo-mcp-server http --configuration my-config.json
```

## Recommended Agents

Because the full DataForSEO MCP exposes 157 tools across 10 modules, loading every tool into a single agent context is rarely efficient. The configurations below show how to group related modules into focused, purpose-built agents using the `ENABLED_MODULES` environment variable. Each agent stays well within the practical tool-count limits of most LLM hosts while covering a coherent set of use cases.

<details>
<summary><strong>1. SERP &amp; Search Agent</strong> — 35 tools (SERP + Keywords Data)</summary>

**Modules:** `SERP`, `KEYWORDS_DATA`

**Use cases:** keyword research, search volume analysis, real-time SERP monitoring, Google/Bing Ads intelligence, trends analysis, YouTube research, autocomplete discovery.

**Environment:**
```bash
export ENABLED_MODULES="SERP,KEYWORDS_DATA"
```

**Tools included:**

*SERP (21):* `serp_ai_summary`, `serp_baidu_organic_live_advanced`, `serp_google_ads_search_live_advanced`, `serp_google_ai_mode_live_advanced`, `serp_google_autocomplete_live_advanced`, `serp_google_dataset_search_live_advanced`, `serp_google_events_live_advanced`, `serp_google_images_live_advanced`, `serp_google_jobs_live_advanced`, `serp_google_local_finder_live_advanced`, `serp_google_maps_live_advanced`, `serp_google_news_live_advanced`, `serp_google_search_by_image_live_advanced`, `serp_locations`, `serp_naver_organic_live_advanced`, `serp_screenshot`, `serp_youtube_locations`, `serp_youtube_organic_live_advanced`, `serp_youtube_video_comments_live_advanced`, `serp_youtube_video_info_live_advanced`, `serp_youtube_video_subtitles_live_advanced`

*Keywords Data (14):* `keywords_data_bing_keyword_performance`, `keywords_data_bing_keywords_for_keywords`, `keywords_data_bing_keywords_for_site`, `keywords_data_bing_search_volume`, `keywords_data_clickstream_search_volume`, `keywords_data_dataforseo_trends_demography`, `keywords_data_dataforseo_trends_explore`, `keywords_data_dataforseo_trends_subregion_interests`, `keywords_data_google_ads_ad_traffic_by_keywords`, `keywords_data_google_ads_keywords_for_keywords`, `keywords_data_google_ads_keywords_for_site`, `keywords_data_google_ads_search_volume`, `keywords_data_google_trends_categories`, `keywords_data_google_trends_explore`

</details>

<details>
<summary><strong>2. Technical SEO Agent</strong> — 18 tools (OnPage)</summary>

**Modules:** `ONPAGE`

**Use cases:** site crawling, Core Web Vitals and Lighthouse auditing, duplicate content detection, redirect chain analysis, page screenshot capture, resource waterfall analysis, non-indexable page identification.

**Environment:**
```bash
export ENABLED_MODULES="ONPAGE"
```

**Tools included:**

*OnPage (18):* `on_page_content_parsing`, `on_page_duplicate_content`, `on_page_duplicate_tags`, `on_page_force_stop`, `on_page_instant_pages`, `on_page_keyword_density`, `on_page_lighthouse_live_json`, `on_page_lighthouse_task_post`, `on_page_links`, `on_page_non_indexable`, `on_page_page_screenshot`, `on_page_pages`, `on_page_redirect_chains`, `on_page_resources`, `on_page_summary`, `on_page_task_post`, `on_page_waterfall`

</details>

<details>
<summary><strong>3. Domain &amp; Backlink Agent</strong> — 50 tools (DataForSEO Labs + Backlinks)</summary>

**Modules:** `DATAFORSEO_LABS`, `BACKLINKS`

**Use cases:** competitor gap analysis, keyword difficulty scoring, bulk traffic estimation, domain rank overviews, backlink audits, referring domain and network analysis, spam score checks, historical link data.

**Environment:**
```bash
export ENABLED_MODULES="DATAFORSEO_LABS,BACKLINKS"
```

**Tools included:**

*DataForSEO Labs (29):* `dataforseo_labs_amazon_bulk_search_volume`, `dataforseo_labs_amazon_product_competitors`, `dataforseo_labs_amazon_product_keyword_intersections`, `dataforseo_labs_amazon_product_rank_overview`, `dataforseo_labs_amazon_ranked_keywords`, `dataforseo_labs_amazon_related_keywords`, `dataforseo_labs_available_filters`, `dataforseo_labs_bulk_keyword_difficulty`, `dataforseo_labs_bulk_traffic_estimation`, `dataforseo_labs_google_categories_for_domain`, `dataforseo_labs_google_competitors_domain`, `dataforseo_labs_google_domain_intersection`, `dataforseo_labs_google_domain_metrics_by_categories`, `dataforseo_labs_google_domain_rank_overview`, `dataforseo_labs_google_domain_whois_overview`, `dataforseo_labs_google_historical_keyword_data`, `dataforseo_labs_google_historical_rank_overview`, `dataforseo_labs_google_keyword_ideas`, `dataforseo_labs_google_keyword_overview`, `dataforseo_labs_google_keyword_suggestions`, `dataforseo_labs_google_keywords_for_categories`, `dataforseo_labs_google_keywords_for_site`, `dataforseo_labs_google_page_intersection`, `dataforseo_labs_google_ranked_keywords`, `dataforseo_labs_google_related_keywords`, `dataforseo_labs_google_relevant_pages`, `dataforseo_labs_google_serp_competitors`, `dataforseo_labs_google_top_searches`, `dataforseo_labs_search_intent`

*Backlinks (21):* `backlinks_anchors`, `backlinks_available_filters`, `backlinks_backlinks`, `backlinks_bulk_backlinks`, `backlinks_bulk_new_lost_backlinks`, `backlinks_bulk_new_lost_referring_domains`, `backlinks_bulk_ranks`, `backlinks_bulk_referring_domains`, `backlinks_bulk_spam_score`, `backlinks_competitors`, `backlinks_domain_intersection`, `backlinks_domain_pages`, `backlinks_domain_pages_summary`, `backlinks_history`, `backlinks_page_intersection`, `backlinks_referring_domains`, `backlinks_referring_networks`, `backlinks_summary`, `backlinks_timeseries_new_lost_summary`, `backlinks_timeseries_summary`

</details>

<details>
<summary><strong>4. Business &amp; Local Agent</strong> — 25 tools (Business Data + Content Analysis)</summary>

**Modules:** `BUSINESS_DATA`, `CONTENT_ANALYSIS`

**Use cases:** local business research, Google My Business data, hotel and travel listings, review aggregation (Google, Trustpilot, Tripadvisor), social media monitoring (Facebook, Pinterest, Reddit), brand sentiment analysis, citation tracking.

**Environment:**
```bash
export ENABLED_MODULES="BUSINESS_DATA,CONTENT_ANALYSIS"
```

**Tools included:**

*Business Data (18):* `business_data_business_listings_categories_aggregation`, `business_data_business_listings_filters`, `business_data_business_listings_search`, `business_data_google_hotel_info`, `business_data_google_hotel_searches`, `business_data_google_my_business_info`, `business_data_google_my_business_updates`, `business_data_google_questions_answers`, `business_data_google_reviews`, `business_data_social_media_facebook`, `business_data_social_media_pinterest`, `business_data_social_media_reddit`, `business_data_tripadvisor_reviews`, `business_data_tripadvisor_search`, `business_data_trustpilot_reviews`, `business_data_trustpilot_search`

*Content Analysis (7):* `content_analysis_categories`, `content_analysis_category_trends`, `content_analysis_phrase_trends`, `content_analysis_rating_distribution`, `content_analysis_search`, `content_analysis_sentiment_analysis`, `content_analysis_summary`

</details>

<details>
<summary><strong>5. AI &amp; App Intelligence Agent</strong> — 26 tools (AI Optimization + App Data)</summary>

**Modules:** `AI_OPTIMIZATION`, `APP_DATA`

**Use cases:** LLM brand mention tracking, AI model response analysis (ChatGPT, Claude, Gemini, Perplexity), AI keyword volume, app store research and review mining for Google Play and Apple App Store.

**Environment:**
```bash
export ENABLED_MODULES="AI_OPTIMIZATION,APP_DATA"
```

**Tools included:**

*AI Optimization (16):* `ai_optimization_ai_keyword_data_search_volume`, `ai_optimization_available_filters`, `ai_optimization_llm_mentions_aggregated_metrics`, `ai_optimization_llm_mentions_cross_aggregated`, `ai_optimization_llm_mentions_search`, `ai_optimization_llm_mentions_top_domains`, `ai_optimization_llm_mentions_top_pages`, `ai_optimization_llm_responses_chatgpt`, `ai_optimization_llm_responses_chatgpt_models`, `ai_optimization_llm_responses_claude`, `ai_optimization_llm_responses_claude_models`, `ai_optimization_llm_responses_gemini`, `ai_optimization_llm_responses_gemini_models`, `ai_optimization_llm_responses_perplexity`, `ai_optimization_llm_responses_perplexity_models`, `ai_optimization_llm_scraper_chatgpt`

*App Data (10):* `app_data_apple_app_info`, `app_data_apple_app_list`, `app_data_apple_app_listings_search`, `app_data_apple_app_reviews`, `app_data_apple_app_searches`, `app_data_apple_categories`, `app_data_google_categories`, `app_data_google_play_app_info`, `app_data_google_play_app_list`, `app_data_google_play_app_listings_search`

</details>

<details>
<summary><strong>6. Domain Analytics Agent</strong> — 10 tools (Domain Analytics)</summary>

**Modules:** `DOMAIN_ANALYTICS`

**Use cases:** technology stack fingerprinting, bulk domain technology discovery, HTML-term-based domain search, WHOIS ownership and expiry lookups, technology adoption trend analysis.

**Environment:**
```bash
export ENABLED_MODULES="DOMAIN_ANALYTICS"
```

**Tools included:**

*Domain Analytics (10):* `domain_analytics_technologies_aggregation`, `domain_analytics_technologies_available_filters`, `domain_analytics_technologies_domain_technologies`, `domain_analytics_technologies_domains_by_html_terms`, `domain_analytics_technologies_domains_by_technology`, `domain_analytics_technologies_summary`, `domain_analytics_technologies_technology_stats`, `domain_analytics_whois_available_filters`, `domain_analytics_whois_overview`

</details>

## What endpoints/APIs do you want us to support next?

We're always looking to expand the capabilities of this MCP server. If you have specific DataForSEO endpoints or APIs you'd like to see supported, please:

1. Check the [DataForSEO API Documentation](https://docs.dataforseo.com/v3/) to see what's available
2. Open an issue in our GitHub repository with:
   - The API/endpoint you'd like to see supported;
   - A brief description of your use case;
   - Describe any specific features you'd like to see implemented.

Your feedback helps us prioritize which APIs to support next!

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/quickstart)
- [DataForSEO API Documentation](https://docs.dataforseo.com/)
