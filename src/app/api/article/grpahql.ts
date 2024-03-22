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
