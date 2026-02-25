# DataForSEO MCP Server — Gap Closure Plan

## Context

The MCP server currently implements **73 tools across 8 modules**, covering ~16% of DataForSEO's ~380+ API endpoints. This plan closes the gap to ~90%+ coverage across 7 phases, each independently shippable. Work is organized by module to minimize context switching. Each phase adds 12-25 tools.

**Key decisions:**
- **Live endpoints only** — MCP interactions are synchronous; async task_post/tasks_ready/task_get workflows are deferred
- **Follow existing patterns exactly** — every tool extends `BaseTool`, every module extends `BaseModule`, same file naming, same registration pattern
- **No test framework exists** — verification = `npm run build` succeeds + manual spot-check

---

## Phase 1: SERP Module Expansion (+15 tools)

**Goal:** Add missing Google search types, engines, and utilities.

### New tool files in `src/core/modules/serp/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `serp-google-maps-live-advanced.tool.ts` | `serp_google_maps_live_advanced` | `/v3/serp/google/maps/live/advanced` |
| 2 | `serp-google-local-finder-live-advanced.tool.ts` | `serp_google_local_finder_live_advanced` | `/v3/serp/google/local_finder/live/advanced` |
| 3 | `serp-google-news-live-advanced.tool.ts` | `serp_google_news_live_advanced` | `/v3/serp/google/news/live/advanced` |
| 4 | `serp-google-images-live-advanced.tool.ts` | `serp_google_images_live_advanced` | `/v3/serp/google/images/live/advanced` |
| 5 | `serp-google-search-by-image-live-advanced.tool.ts` | `serp_google_search_by_image_live_advanced` | `/v3/serp/google/search_by_image/live/advanced` |
| 6 | `serp-google-jobs-live-advanced.tool.ts` | `serp_google_jobs_live_advanced` | `/v3/serp/google/jobs/live/advanced` |
| 7 | `serp-google-events-live-advanced.tool.ts` | `serp_google_events_live_advanced` | `/v3/serp/google/events/live/advanced` |
| 8 | `serp-google-autocomplete-live-advanced.tool.ts` | `serp_google_autocomplete_live_advanced` | `/v3/serp/google/autocomplete/live/advanced` |
| 9 | `serp-google-ai-mode-live-advanced.tool.ts` | `serp_google_ai_mode_live_advanced` | `/v3/serp/google/ai_mode/live/advanced` |
| 10 | `serp-google-dataset-search-live-advanced.tool.ts` | `serp_google_dataset_search_live_advanced` | `/v3/serp/google/dataset_search/live/advanced` |
| 11 | `serp-google-ads-search-live-advanced.tool.ts` | `serp_google_ads_search_live_advanced` | `/v3/serp/google/ads_search/live/advanced` |
| 12 | `serp-baidu-organic-live-advanced.tool.ts` | `serp_baidu_organic_live_advanced` | `/v3/serp/baidu/organic/live/advanced` |
| 13 | `serp-naver-organic-live-advanced.tool.ts` | `serp_naver_organic_live_advanced` | `/v3/serp/naver/organic/live/advanced` |
| 14 | `serp-screenshot.tool.ts` | `serp_screenshot` | `/v3/serp/screenshot` |
| 15 | `serp-ai-summary.tool.ts` | `serp_ai_summary` | `/v3/serp/ai_summary` |

### Files to modify:
- `src/core/modules/serp/serp-api.module.ts` — import + register 15 new tools in `getTools()`

### Verification:
```bash
npm run build
```

---

## Phase 2: OnPage Module Expansion (+15 tools)

**Goal:** Add full crawl workflow, page analysis tools, and Lighthouse.

### New tool files in `src/core/modules/onpage/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `onpage-task-post.tool.ts` | `on_page_task_post` | `/v3/on_page/task_post` |
| 2 | `onpage-summary.tool.ts` | `on_page_summary` | `/v3/on_page/summary/{task_id}` |
| 3 | `onpage-pages.tool.ts` | `on_page_pages` | `/v3/on_page/pages/{task_id}` |
| 4 | `onpage-resources.tool.ts` | `on_page_resources` | `/v3/on_page/resources/{task_id}` |
| 5 | `onpage-links.tool.ts` | `on_page_links` | `/v3/on_page/links/{task_id}` |
| 6 | `onpage-redirect-chains.tool.ts` | `on_page_redirect_chains` | `/v3/on_page/redirect_chains/{task_id}` |
| 7 | `onpage-non-indexable.tool.ts` | `on_page_non_indexable` | `/v3/on_page/non_indexable/{task_id}` |
| 8 | `onpage-duplicate-tags.tool.ts` | `on_page_duplicate_tags` | `/v3/on_page/duplicate_tags/{task_id}` |
| 9 | `onpage-duplicate-content.tool.ts` | `on_page_duplicate_content` | `/v3/on_page/duplicate_content/{task_id}` |
| 10 | `onpage-keyword-density.tool.ts` | `on_page_keyword_density` | `/v3/on_page/keyword_density/{task_id}` |
| 11 | `onpage-waterfall.tool.ts` | `on_page_waterfall` | `/v3/on_page/waterfall/{task_id}` |
| 12 | `onpage-page-screenshot.tool.ts` | `on_page_page_screenshot` | `/v3/on_page/page_screenshot` |
| 13 | `onpage-lighthouse-live-json.tool.ts` | `on_page_lighthouse_live_json` | `/v3/on_page/lighthouse/live/json` |
| 14 | `onpage-lighthouse-task-post.tool.ts` | `on_page_lighthouse_task_post` | `/v3/on_page/lighthouse/task_post` |
| 15 | `onpage-force-stop.tool.ts` | `on_page_force_stop` | `/v3/on_page/force_stop` |

**Note:** OnPage crawl results use GET with task_id path params (not POST). These tools will need `supportOnlyFullResponse()` returning `true` and use `makeRequest(endpoint, 'GET')`.

### Files to modify:
- `src/core/modules/onpage/onpage-api.module.ts` — import + register 15 new tools

### Verification:
```bash
npm run build
```

---

## Phase 3: Business Data & Content Analysis Expansion (+18 tools)

**Goal:** Complete Business Data with Google, Trustpilot, Tripadvisor, Social Media. Complete Content Analysis.

### New tool files in `src/core/modules/business-data-api/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `google/google-my-business-info.tool.ts` | `business_data_google_my_business_info` | `/v3/business_data/google/my_business_info/live` |
| 2 | `google/google-my-business-updates.tool.ts` | `business_data_google_my_business_updates` | `/v3/business_data/google/my_business_updates/task_post` |
| 3 | `google/google-reviews.tool.ts` | `business_data_google_reviews` | `/v3/business_data/google/reviews/task_post` |
| 4 | `google/google-questions-answers.tool.ts` | `business_data_google_questions_answers` | `/v3/business_data/google/questions_and_answers/live` |
| 5 | `google/google-hotel-searches.tool.ts` | `business_data_google_hotel_searches` | `/v3/business_data/google/hotel_searches/live` |
| 6 | `google/google-hotel-info.tool.ts` | `business_data_google_hotel_info` | `/v3/business_data/google/hotel_info/live` |
| 7 | `trustpilot/trustpilot-search.tool.ts` | `business_data_trustpilot_search` | `/v3/business_data/trustpilot/search/task_post` |
| 8 | `trustpilot/trustpilot-reviews.tool.ts` | `business_data_trustpilot_reviews` | `/v3/business_data/trustpilot/reviews/task_post` |
| 9 | `tripadvisor/tripadvisor-search.tool.ts` | `business_data_tripadvisor_search` | `/v3/business_data/tripadvisor/search/task_post` |
| 10 | `tripadvisor/tripadvisor-reviews.tool.ts` | `business_data_tripadvisor_reviews` | `/v3/business_data/tripadvisor/reviews/task_post` |
| 11 | `social-media/social-media-facebook.tool.ts` | `business_data_social_media_facebook` | `/v3/business_data/social_media/facebook/live` |
| 12 | `social-media/social-media-pinterest.tool.ts` | `business_data_social_media_pinterest` | `/v3/business_data/social_media/pinterest/live` |
| 13 | `social-media/social-media-reddit.tool.ts` | `business_data_social_media_reddit` | `/v3/business_data/social_media/reddit/live` |
| 14 | `listings/business-listings-categories-aggregation.tool.ts` | `business_data_business_listings_categories_aggregation` | `/v3/business_data/business_listings/categories_aggregation/live` |

### New tool files in `src/core/modules/content-analysis/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 15 | `content-analysis-sentiment.tool.ts` | `content_analysis_sentiment_analysis` | `/v3/content_analysis/sentiment_analysis/live` |
| 16 | `content-analysis-rating-distribution.tool.ts` | `content_analysis_rating_distribution` | `/v3/content_analysis/rating_distribution/live` |
| 17 | `content-analysis-category-trends.tool.ts` | `content_analysis_category_trends` | `/v3/content_analysis/category_trends/live` |
| 18 | `content-analysis-categories.tool.ts` | `content_analysis_categories` | `/v3/content_analysis/categories` |

### Files to modify:
- `src/core/modules/business-data-api/business-data-api.module.ts` — import + register 14 tools
- `src/core/modules/content-analysis/content-analysis-api.module.ts` — import + register 4 tools

### Verification:
```bash
npm run build
```

---

## Phase 4: Keywords Data, DataForSEO Labs & Domain Analytics Expansion (+25 tools)

**Goal:** Fill remaining gaps in three existing modules.

### Keywords Data — new files in `src/core/modules/keywords-data/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `google-ads/google-ads-keywords-for-site.tool.ts` | `keywords_data_google_ads_keywords_for_site` | `/v3/keywords_data/google_ads/keywords_for_site/live` |
| 2 | `google-ads/google-ads-keywords-for-keywords.tool.ts` | `keywords_data_google_ads_keywords_for_keywords` | `/v3/keywords_data/google_ads/keywords_for_keywords/live` |
| 3 | `google-ads/google-ads-ad-traffic-by-keywords.tool.ts` | `keywords_data_google_ads_ad_traffic_by_keywords` | `/v3/keywords_data/google_ads/ad_traffic_by_keywords/live` |
| 4 | `bing/bing-search-volume.tool.ts` | `keywords_data_bing_search_volume` | `/v3/keywords_data/bing/search_volume/live` |
| 5 | `bing/bing-keywords-for-site.tool.ts` | `keywords_data_bing_keywords_for_site` | `/v3/keywords_data/bing/keywords_for_site/live` |
| 6 | `bing/bing-keywords-for-keywords.tool.ts` | `keywords_data_bing_keywords_for_keywords` | `/v3/keywords_data/bing/keywords_for_keywords/live` |
| 7 | `bing/bing-keyword-performance.tool.ts` | `keywords_data_bing_keyword_performance` | `/v3/keywords_data/bing/keyword_performance/live` |
| 8 | `clickstream/clickstream-search-volume.tool.ts` | `keywords_data_clickstream_search_volume` | `/v3/keywords_data/dataforseo_trends/merged_data/live` |

### DataForSEO Labs — new files in `src/core/modules/dataforseo-labs/tools/google/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 9 | `keyword-research/google-categories-for-domain.tool.ts` | `dataforseo_labs_google_categories_for_domain` | `/v3/dataforseo_labs/google/categories_for_domain/live` |
| 10 | `keyword-research/google-keywords-for-categories.tool.ts` | `dataforseo_labs_google_keywords_for_categories` | `/v3/dataforseo_labs/google/keywords_for_categories/live` |
| 11 | `keyword-research/google-domain-metrics-by-categories.tool.ts` | `dataforseo_labs_google_domain_metrics_by_categories` | `/v3/dataforseo_labs/google/domain_metrics_by_categories/live` |
| 12 | `competitor-research/google-domain-whois-overview.tool.ts` | `dataforseo_labs_google_domain_whois_overview` | `/v3/dataforseo_labs/google/domain_whois_overview/live` |
| 13 | `competitor-research/google-relevant-pages.tool.ts` | `dataforseo_labs_google_relevant_pages` | `/v3/dataforseo_labs/google/relevant_pages/live` |

### DataForSEO Labs Amazon — new files in `src/core/modules/dataforseo-labs/tools/amazon/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 14 | `amazon-bulk-search-volume.tool.ts` | `dataforseo_labs_amazon_bulk_search_volume` | `/v3/dataforseo_labs/amazon/bulk_search_volume/live` |
| 15 | `amazon-related-keywords.tool.ts` | `dataforseo_labs_amazon_related_keywords` | `/v3/dataforseo_labs/amazon/related_keywords/live` |
| 16 | `amazon-ranked-keywords.tool.ts` | `dataforseo_labs_amazon_ranked_keywords` | `/v3/dataforseo_labs/amazon/ranked_keywords/live` |
| 17 | `amazon-product-rank-overview.tool.ts` | `dataforseo_labs_amazon_product_rank_overview` | `/v3/dataforseo_labs/amazon/product_rank_overview/live` |
| 18 | `amazon-product-competitors.tool.ts` | `dataforseo_labs_amazon_product_competitors` | `/v3/dataforseo_labs/amazon/product_competitors/live` |
| 19 | `amazon-product-keyword-intersections.tool.ts` | `dataforseo_labs_amazon_product_keyword_intersections` | `/v3/dataforseo_labs/amazon/product_keyword_intersections/live` |

### Domain Analytics — new files in `src/core/modules/domain-analytics/tools/technologies/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 20 | `domains-by-technology.tool.ts` | `domain_analytics_technologies_domains_by_technology` | `/v3/domain_analytics/technologies/domains_by_technology/live` |
| 21 | `domains-by-html-terms.tool.ts` | `domain_analytics_technologies_domains_by_html_terms` | `/v3/domain_analytics/technologies/domains_by_html_terms/live` |
| 22 | `technologies-summary.tool.ts` | `domain_analytics_technologies_summary` | `/v3/domain_analytics/technologies/technologies_summary/live` |
| 23 | `technology-stats.tool.ts` | `domain_analytics_technologies_technology_stats` | `/v3/domain_analytics/technologies/technology_stats/live` |
| 24 | `aggregation-technologies.tool.ts` | `domain_analytics_technologies_aggregation` | `/v3/domain_analytics/technologies/aggregation_technologies/live` |

### Backlinks — new files in `src/core/modules/backlinks/tools/`:

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 25 | `backlinks-history.tool.ts` | `backlinks_history` | `/v3/backlinks/history/live` |

### Files to modify:
- `src/core/modules/keywords-data/keywords-data-api.module.ts` — register 8 tools
- `src/core/modules/dataforseo-labs/dataforseo-labs-api.module.ts` — register 11 tools
- `src/core/modules/domain-analytics/domain-analytics-api.module.ts` — register 5 tools
- `src/core/modules/backlinks/backlinks-api.module.ts` — register 1 tool

### Verification:
```bash
npm run build
```

---

## Phase 5: AI Optimization API (NEW MODULE, +16 tools)

**Goal:** Add the brand-new AI Optimization module — the most strategically important gap.

### New directory: `src/core/modules/ai-optimization/`

#### Module file: `ai-optimization-api.module.ts`

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `tools/llm-responses/chatgpt-live.tool.ts` | `ai_optimization_llm_responses_chatgpt` | `/v3/ai_optimization/llm_responses/chatgpt/live` |
| 2 | `tools/llm-responses/claude-live.tool.ts` | `ai_optimization_llm_responses_claude` | `/v3/ai_optimization/llm_responses/claude/live` |
| 3 | `tools/llm-responses/gemini-live.tool.ts` | `ai_optimization_llm_responses_gemini` | `/v3/ai_optimization/llm_responses/gemini/live` |
| 4 | `tools/llm-responses/perplexity-live.tool.ts` | `ai_optimization_llm_responses_perplexity` | `/v3/ai_optimization/llm_responses/perplexity/live` |
| 5 | `tools/llm-responses/chatgpt-models.tool.ts` | `ai_optimization_llm_responses_chatgpt_models` | `/v3/ai_optimization/llm_responses/chatgpt/models` |
| 6 | `tools/llm-responses/claude-models.tool.ts` | `ai_optimization_llm_responses_claude_models` | `/v3/ai_optimization/llm_responses/claude/models` |
| 7 | `tools/llm-responses/gemini-models.tool.ts` | `ai_optimization_llm_responses_gemini_models` | `/v3/ai_optimization/llm_responses/gemini/models` |
| 8 | `tools/llm-scraper/chatgpt-scraper-live.tool.ts` | `ai_optimization_llm_scraper_chatgpt` | `/v3/ai_optimization/llm_scraper/chatgpt/live/advanced` |
| 9 | `tools/ai-keyword-data/keywords-search-volume.tool.ts` | `ai_optimization_ai_keyword_data_search_volume` | `/v3/ai_optimization/ai_keyword_data/keywords_search_volume/live` |
| 10 | `tools/llm-mentions/llm-mentions-search.tool.ts` | `ai_optimization_llm_mentions_search` | `/v3/ai_optimization/llm_mentions/search/live` |
| 11 | `tools/llm-mentions/llm-mentions-aggregated-metrics.tool.ts` | `ai_optimization_llm_mentions_aggregated_metrics` | `/v3/ai_optimization/llm_mentions/aggregated_metrics/live` |
| 12 | `tools/llm-mentions/llm-mentions-cross-aggregated.tool.ts` | `ai_optimization_llm_mentions_cross_aggregated` | `/v3/ai_optimization/llm_mentions/cross_aggregated_metrics/live` |
| 13 | `tools/llm-mentions/llm-mentions-top-domains.tool.ts` | `ai_optimization_llm_mentions_top_domains` | `/v3/ai_optimization/llm_mentions/top_domains/live` |
| 14 | `tools/llm-mentions/llm-mentions-top-pages.tool.ts` | `ai_optimization_llm_mentions_top_pages` | `/v3/ai_optimization/llm_mentions/top_pages/live` |
| 15 | `tools/llm-responses/perplexity-models.tool.ts` | `ai_optimization_llm_responses_perplexity_models` | `/v3/ai_optimization/llm_responses/perplexity/models` |
| 16 | `tools/ai-optimization-filters.tool.ts` | `ai_optimization_available_filters` | (filter discovery tool) |

### Files to create:
- `src/core/modules/ai-optimization/ai-optimization-api.module.ts`
- 16 tool files as listed above

### Files to modify:
- `src/core/config/modules.config.ts` — add `'AI_OPTIMIZATION'` to `AVAILABLE_MODULES`
- `src/core/utils/module-loader.ts` — import + conditional load
- `src/main/index.ts` — no change needed (dynamic via module loader)
- `src/main/index-http.ts` — no change needed
- `src/worker/index-worker.ts` — no change needed

### Verification:
```bash
npm run build
```

---

## Phase 6: Merchant API (NEW MODULE, +12 tools)

**Goal:** Add e-commerce data via Google Shopping and Amazon.

### New directory: `src/core/modules/merchant/`

#### Module file: `merchant-api.module.ts`

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `tools/google/google-shopping-products.tool.ts` | `merchant_google_products` | `/v3/merchant/google/products/live/advanced` |
| 2 | `tools/google/google-shopping-product-info.tool.ts` | `merchant_google_product_info` | `/v3/merchant/google/product_info/live/advanced` |
| 3 | `tools/google/google-shopping-sellers.tool.ts` | `merchant_google_sellers` | `/v3/merchant/google/sellers/live/advanced` |
| 4 | `tools/google/google-shopping-reviews.tool.ts` | `merchant_google_reviews` | `/v3/merchant/google/reviews/live/advanced` |
| 5 | `tools/google/google-shopping-sellers-ad-url.tool.ts` | `merchant_google_sellers_ad_url` | `/v3/merchant/google/sellers/ad_url` |
| 6 | `tools/amazon/amazon-products.tool.ts` | `merchant_amazon_products` | `/v3/merchant/amazon/products/live/advanced` |
| 7 | `tools/amazon/amazon-asin.tool.ts` | `merchant_amazon_asin` | `/v3/merchant/amazon/asin/live/advanced` |
| 8 | `tools/amazon/amazon-sellers.tool.ts` | `merchant_amazon_sellers` | `/v3/merchant/amazon/sellers/live/advanced` |
| 9 | `tools/merchant-locations.tool.ts` | `merchant_google_locations` | `/v3/merchant/google/locations` |
| 10 | `tools/merchant-languages.tool.ts` | `merchant_google_languages` | `/v3/merchant/google/languages` |
| 11 | `tools/merchant-amazon-locations.tool.ts` | `merchant_amazon_locations` | `/v3/merchant/amazon/locations` |
| 12 | `tools/merchant-amazon-languages.tool.ts` | `merchant_amazon_languages` | `/v3/merchant/amazon/languages` |

### Files to modify:
- `src/core/config/modules.config.ts` — add `'MERCHANT'`
- `src/core/utils/module-loader.ts` — import + conditional load

### Verification:
```bash
npm run build
```

---

## Phase 7: App Data API (NEW MODULE, +12 tools)

**Goal:** Add App Store Optimization data for Google Play and Apple.

### New directory: `src/core/modules/app-data/`

#### Module file: `app-data-api.module.ts`

| # | File | Tool Name | Endpoint |
|---|------|-----------|----------|
| 1 | `tools/google-play/google-play-app-searches.tool.ts` | `app_data_google_play_app_searches` | `/v3/app_data/google/app_searches/live/advanced` |
| 2 | `tools/google-play/google-play-app-list.tool.ts` | `app_data_google_play_app_list` | `/v3/app_data/google/app_list/live/advanced` |
| 3 | `tools/google-play/google-play-app-info.tool.ts` | `app_data_google_play_app_info` | `/v3/app_data/google/app_info/live/advanced` |
| 4 | `tools/google-play/google-play-app-reviews.tool.ts` | `app_data_google_play_app_reviews` | `/v3/app_data/google/app_reviews/live/advanced` |
| 5 | `tools/google-play/google-play-app-listings-search.tool.ts` | `app_data_google_play_app_listings_search` | `/v3/app_data/google/app_listings/search/live` |
| 6 | `tools/apple/apple-app-searches.tool.ts` | `app_data_apple_app_searches` | `/v3/app_data/apple/app_searches/live/advanced` |
| 7 | `tools/apple/apple-app-list.tool.ts` | `app_data_apple_app_list` | `/v3/app_data/apple/app_list/live/advanced` |
| 8 | `tools/apple/apple-app-info.tool.ts` | `app_data_apple_app_info` | `/v3/app_data/apple/app_info/live/advanced` |
| 9 | `tools/apple/apple-app-reviews.tool.ts` | `app_data_apple_app_reviews` | `/v3/app_data/apple/app_reviews/live/advanced` |
| 10 | `tools/apple/apple-app-listings-search.tool.ts` | `app_data_apple_app_listings_search` | `/v3/app_data/apple/app_listings/search/live` |
| 11 | `tools/app-data-categories.tool.ts` | `app_data_google_categories` | `/v3/app_data/google/categories` |
| 12 | `tools/app-data-apple-categories.tool.ts` | `app_data_apple_categories` | `/v3/app_data/apple/categories` |

### Files to modify:
- `src/core/config/modules.config.ts` — add `'APP_DATA'`
- `src/core/utils/module-loader.ts` — import + conditional load

### Verification:
```bash
npm run build
```

---

## Deferred (Not in scope)

| Category | Reason |
|----------|--------|
| Content Generation API | LLMs already do this natively; low value for MCP |
| Databases API | Bulk download — not suited to MCP tool pattern |
| Appendix API | Admin/utility — not useful as MCP tools |
| Async task workflows (task_post/tasks_ready/task_get) | MCP is synchronous; live endpoints preferred |
| DataForSEO Labs: Apple App Store (4 tools) | Can add in Phase 7 if needed |
| SERP: Seznam, Bing Local Pack, Google Finance types | Very niche; can add on request |

---

## Summary

| Phase | Focus | New Tools | Cumulative Total | Coverage |
|-------|-------|-----------|-----------------|----------|
| Current | — | 73 | 73 | ~16% |
| Phase 1 | SERP expansion | +15 | 88 | ~23% |
| Phase 2 | OnPage expansion | +15 | 103 | ~27% |
| Phase 3 | Business Data + Content Analysis | +18 | 121 | ~32% |
| Phase 4 | Keywords, Labs, Domain Analytics, Backlinks | +25 | 146 | ~38% |
| Phase 5 | AI Optimization (NEW) | +16 | 162 | ~42% |
| Phase 6 | Merchant (NEW) | +12 | 174 | ~45% |
| Phase 7 | App Data (NEW) | +12 | 186 | ~49% |

**Note on coverage %:** The ~380 endpoint count includes all method variations (task_post + tasks_ready + task_get + live for the same logical endpoint). Since we're implementing live-only, 186 tools covers the vast majority of **unique API capabilities** (~90%+ of distinct data access points). The remaining ~200 "endpoints" are async workflow variants of the same data.

---

## Execution Strategy

- Use an **agent team** with Sonnet workers parallelized by phase
- Each phase is a separate git branch, merged to master after build verification
- Consult DataForSEO API docs (`docs.dataforseo.com/v3/`) for exact parameter schemas per tool
- Commit after each phase with descriptive message
