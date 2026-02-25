import { BaseModule, ToolDefinition } from '../base.module.js';
import { DomainTechnologiesTool } from './tools/technologies/domain-technologies.tool.js';
import { DomainTechnologiesFiltersTool } from './tools/technologies/domain-technologies-filters.tool.js';
import { WhoisFiltersTool } from './tools/whois/whois-filters.tool.js';
import { WhoisOverviewTool } from './tools/whois/whois-overview.tool.js';
import { DomainAnalyticsTechnologiesDomainsByTechnologyTool } from './tools/technologies/domains-by-technology.tool.js';
import { DomainAnalyticsTechnologiesDomainsByHtmlTermsTool } from './tools/technologies/domains-by-html-terms.tool.js';
import { DomainAnalyticsTechnologiesSummaryTool } from './tools/technologies/technologies-summary.tool.js';
import { DomainAnalyticsTechnologiesTechnologyStatsTool } from './tools/technologies/technology-stats.tool.js';
import { DomainAnalyticsTechnologiesAggregationTool } from './tools/technologies/aggregation-technologies.tool.js';

export class DomainAnalyticsApiModule extends BaseModule {
  getTools(): Record<string, ToolDefinition> {
    const tools = [
      new WhoisOverviewTool(this.dataForSEOClient),
      new WhoisFiltersTool(this.dataForSEOClient),
      new DomainTechnologiesTool(this.dataForSEOClient),
      new DomainTechnologiesFiltersTool(this.dataForSEOClient),
      new DomainAnalyticsTechnologiesDomainsByTechnologyTool(this.dataForSEOClient),
      new DomainAnalyticsTechnologiesDomainsByHtmlTermsTool(this.dataForSEOClient),
      new DomainAnalyticsTechnologiesSummaryTool(this.dataForSEOClient),
      new DomainAnalyticsTechnologiesTechnologyStatsTool(this.dataForSEOClient),
      new DomainAnalyticsTechnologiesAggregationTool(this.dataForSEOClient),
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
