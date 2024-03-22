import { Reactenv } from "@/utils/helper";

export const AUTHOR_REAL_TIME_DETAILS = `
  query Author($period_date: String!, $author_id: String!, $site_id: String!) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors(where: {author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      name
      articles_aggregate {
        aggregate {
          count
        }
      }
      articles(order_by: {published_date: asc}, limit: 1) {
        article_id
        title
        published_date
      }
    }
    
    AuthorsPageViews:${Reactenv.content_analytics_entity_prefix}author_page_views(where: {author_id: {_eq: $author_id}, period_date: {_eq: $period_date}, author: {site_id: {_eq: $site_id}}}) {
      total_time_spent
      page_views
    }
  
    AuthorsDaily:${Reactenv.content_analytics_entity_prefix}authors_daily(where: {site_id: {_eq: $site_id}, author_id: {_eq: $author_id}, period_date: {_eq: $period_date}}) {
      author_id
      country_distribution
      page_views
      total_time_spent
      period_date
      readability
      recirculation
      medium_distribution
      source_distribution
      device_distribution
      exit_page_distribution
      country_wise_city
      site_id
      users
      new_users
    }

    SiteAvg: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: { _eq: $period_date }
      }
    ) {
      recirculation
      readability
    }

    AuthorsHourly:${Reactenv.content_analytics_entity_prefix}authors_hourly(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, author_id: {_eq: $author_id}}) {
      page_views
      users
      period_hour
    }

    AuthorsHourlyAverage:${Reactenv.content_analytics_entity_prefix}authors_hourly_average(where: {site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}) {
      page_views
      users
      period_hour
    }

    AuthorsTopMedium:${Reactenv.content_analytics_entity_prefix}authors_top_medium_daily(where: {period_date: {_eq: $period_date}, site_id: {_eq: $site_id}, author: {_eq: $author_id}}) {
      users
      org_id
      author
      referer_site
      period_date
      refr_medium
      refr_source
      site_id 
      created_at
    }
  }
`;