import { Reactenv } from "@/utils/helper";

export const REALTIMEVISTOR = `
  query realtime_visitors($period_date: String!, $partial_period_date: String!, $site_id: String) {
    daily_data: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(
      where: {
        site_id: {_eq: $site_id},
        period_date: {_eq: $period_date}
      }
    ) {
      total_time_spent
      users
      average_time_spent
      attention_time
    }

    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_daily(
      limit: 10,
      order_by: {page_views: desc_nulls_last},
      where: {
        period_date: {_eq: $period_date},
        site_id: {_eq: $site_id},
        article: {published_date: {_like: $partial_period_date}}
      }
    ) {
      page_views
      article {
        category
        published_date
        title
        article_id
        authors {
          name
        }
      }
    }

    ArticleCurrentHours: ${Reactenv.content_analytics_entity_prefix}articles_overall_hourly(
      where: {
        site_id: {_eq: $site_id},
        period_date: {_eq: $period_date}
      }
    ) {
      hour
      users
      page_views
      site_id
    }

    NewPostArticles: ${Reactenv.content_analytics_entity_prefix}articles(
      where: {
        site_id: {_eq: $site_id},
        published_date: {_gte: $period_date}
      }
    ) {
      article_id
      published_date
    }

    ArticleAvgHours: ${Reactenv.content_analytics_entity_prefix}articles_overall_hourly_average(
      where: {site_id: {_eq: $site_id}}
    ) {
      hour
      page_views
      users
      site_id
    }
  }
`;

const ARTICLE_DETAILS = `
  query article_header_details($article_id: String!, $site_id: String!, $period_date: String!) {
    Article: ${Reactenv.content_analytics_entity_prefix}articles(
      where: {
        article_id: { _eq: $article_id },
        site_id: { _eq: $site_id }
      },
      limit: 1
    ) {
      title
      category
      published_date
      author
    }

    ArticleDaily: ${Reactenv.content_analytics_entity_prefix}articles_daily(
      where: {
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id },
        site_id: { _eq: $site_id }
      },
      order_by: { page_views: desc }
    ) {
      article_id
      page_views
      users
      new_users
      attention_time
      total_time_spent
      average_time_spent
      bounce_rate
      readability
      recirculation
      valid_play_views
      avg_percent_played
      avg_retention_rate
      avg_playback_rate
      article {
        title
        published_date
        category
      }
      country_distribution
      exit_page_distribution
      referrer_distribution
      social_distribution
      city_distribution
      device_distribution
    }
    
    ArticleDailyAgg: ${Reactenv.content_analytics_entity_prefix}articles_daily_aggregate(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date }
      }
    ) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
          recirculation
          readability
        }
      }
    }
    
    ArticleDailyListAgg: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date }
      }
    ) {
      recirculation
      readability
    }
    
    ArticleHourly: ${Reactenv.content_analytics_entity_prefix}articles_hourly(
      where: {
        site_id: { _eq: $site_id },
        article_id: { _eq: $article_id },
        period_date: { _eq: $period_date }
      }
    ) {
      article_id
      page_views
      hour
      users
      period_date
    }
    
    ArticleHourlyAverage: ${Reactenv.content_analytics_entity_prefix}articles_overall_hourly_average(
      where: { site_id: { _eq: $site_id } }
    ) {
      hour
      page_views
      users
      site_id
    }
    
    ArticleExitDistributionDaily: ${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id }
      },
      order_by: { recirculation_count: desc_nulls_last },
      limit: 5
    ) {
      period_date
      recirculation_count
      users
      article_id
      next_page_article_id
      article {
        title
      }
      recirculation
    }
    
    ArticleScrollDepthDaily: ${Reactenv.content_analytics_entity_prefix}article_scrolldepth_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id }
      }
    ) {
      article_id
      crossed_10_users
      crossed_20_users
      crossed_30_users
      crossed_40_users
      crossed_50_users
      crossed_60_users
      crossed_70_users
      crossed_80_users
      crossed_90_users
      crossed_100_users
      entered_users
    }
    
    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id },
        refr_medium: { _eq: "internal" }
      },
      order_by: { users: desc_nulls_last },
      limit: 1
    ) {
      article_id
      refr_medium
      refr_source
      referer_site
      users
    }
    
    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id },
        refr_medium: { _eq: "social" }
      },
      order_by: { users: desc_nulls_last },
      limit: 1
    ) {
      article_id
      refr_medium
      referer_site
      refr_source
      users
    }
    
    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id },
        refr_medium: { _eq: "unknown" }
      },
      order_by: { users: desc_nulls_last },
      limit: 1
    ) {
      article_id
      refr_medium
      refr_source
      referer_site
      users
    }
    
    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date },
        article_id: { _eq: $article_id },
        refr_medium: { _eq: "search" }
      },
      order_by: { users: desc_nulls_last },
      limit: 1
    ) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
  }
`;

const GET_MONTHLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_monthly($site_id: String!, $article_id: String!, $period_month: Int, $period_year: Int, $partial_period_date: String) {
    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      article_id
      country_distribution
      device_distribution
      social_distribution
      city_distribution
      referrer_distribution
      bounce_rate
      attention_time
      period_year
      total_time_spent
      average_time_spent
      readability
      recirculation
      valid_play_views
      avg_percent_played
      avg_retention_rate
      avg_playback_rate
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ArticleMonthlyAgg:${Reactenv.content_analytics_entity_prefix}articles_monthly_aggregate(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
          recirculation
          readability
        }
      }
    }
    ArticleMonthlyListAgg: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(
      where: {
        site_id: { _eq: $site_id },
        period_month: {_eq: $period_month}, period_year: {_eq: $period_year}
      }
    ) {
        recirculation
        readability
    }
    ArticleScrollDepthMonthly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      article_id
      crossed_10_users
      crossed_20_users
      crossed_30_users
      crossed_40_users
      crossed_50_users
      crossed_60_users
      crossed_70_users
      crossed_80_users
      crossed_90_users
      crossed_100_users
      entered_users
    }

    ArticleExitDistributionMonthly:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 5) {
      article {
        title
      }
      recirculation_count
      users
      period_month
      next_page_article_id
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    ArticleDaily:${Reactenv.content_analytics_entity_prefix}articles_daily(where: {article_id: {_eq: $article_id}, period_date: {_like: $partial_period_date},site_id: {_eq: $site_id}}) {
      article_id
      page_views
      users
      period_date
    }
  }
`;

const GET_YEARLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_yearly($site_id: String!, $article_id: String!, $period_year: Int, $site_avg_period_year: Int) {
    ArticleYearly:${Reactenv.content_analytics_entity_prefix}articles_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      article_id
      country_distribution
      device_distribution
      city_distribution
      social_distribution
      referrer_distribution
      bounce_rate
      attention_time
      total_time_spent
      average_time_spent
      readability
      valid_play_views
      avg_percent_played
      avg_retention_rate
      avg_playback_rate
      recirculation
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ArticleYearlyAgg:${Reactenv.content_analytics_entity_prefix}articles_yearly_aggregate(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
          recirculation
          readability
        }
      }
    }

    ArticleYearlyListAgg: ${Reactenv.content_analytics_entity_prefix}user_analytics_yearly(
      where: {
        site_id: { _eq: $site_id },
        period_year: {_eq: $site_avg_period_year}
      }
    ) {
        recirculation
        readability
    }

    ArticleScrollDepthYearly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      article_id
      crossed_10_users
      crossed_20_users
      crossed_30_users
      crossed_40_users
      crossed_50_users
      crossed_60_users
      crossed_70_users
      crossed_80_users
      crossed_90_users
      crossed_100_users
      entered_users
    }

    ArticleExitDistributionYearly: ${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}},  order_by: {users: desc_nulls_last}, limit: 5) {
      article {
        title
      }
      recirculation_count
      users
      next_page_article_id
      period_year
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id},article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }
    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {article_id: {_eq: $article_id}, site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
      article_id
      page_views
      users
      period_month
      period_year
    }
  }
`;

const GET_QUARTERLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_quarterly($site_id: String!, $article_id: String!, $period_year: Int, $period_quarter: Int, $period_month: [Int]) {
    ArticleQuaterly:${Reactenv.content_analytics_entity_prefix}articles_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      article_id
      country_distribution
      device_distribution
      city_distribution
      social_distribution
      referrer_distribution
      bounce_rate
      attention_time
      total_time_spent
      average_time_spent
      readability
      valid_play_views
      avg_percent_played
      avg_retention_rate
      avg_playback_rate
      recirculation
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ArticleQuaterlyAgg:${Reactenv.content_analytics_entity_prefix}articles_quarterly_aggregate(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
          recirculation
          readability
        }
      }
    }

    ArticleQuarterlyListAgg: ${Reactenv.content_analytics_entity_prefix}user_analytics_quaterly(
      where: {
        site_id: { _eq: $site_id },
        period_year: {_eq: $period_year}, 
        period_quarter: {_eq: $period_quarter}
      }
    ) {
        recirculation
        readability
    }

    ArticleScrollDepthQuaterly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      article_id
      crossed_10_users
      crossed_20_users
      crossed_30_users
      crossed_40_users
      crossed_50_users
      crossed_60_users
      crossed_70_users
      crossed_80_users
      crossed_90_users
      crossed_100_users
      entered_users
    }

    ArticleExitDistributionQuaterly:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}},  order_by: {users: desc_nulls_last}, limit: 5) {
      article {
        title
      }
      recirculation_count
      users
      next_page_article_id
      period_quarter
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      referer_site
      refr_medium
      refr_source
      users
    }

    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {article_id: {_eq: $article_id}, site_id: {_eq: $site_id}, period_month: {_in: $period_month}, period_year: {_eq: $period_year}}) {
      article_id
      page_views
      users
      period_month
    }
  }
`;

const ARTICLE_LIST = `
  query articles($site_id: String!, $article_id: String!) {
    ${Reactenv.content_analytics_entity_prefix}articles(where: {article_id: {_neq: $article_id}, site_id: {_eq: $site_id}, article_daily: { page_views: { _is_null: false }}}, limit: 5, order_by: { article_daily: { page_views: desc } }) {
      title
      article_id
      article_daily {
        page_views
      }
    }
  }
`;

export {
  ARTICLE_DETAILS,
  GET_MONTHLY_DATA,
  GET_YEARLY_DATA,
  GET_QUARTERLY_DATA,
  ARTICLE_LIST
};
