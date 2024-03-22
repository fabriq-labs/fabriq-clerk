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

export const AUTHOR_MONTHLY_DETAILS = `
  query author_monthly_users($period_month: Int, $author_id: String!, $site_id: String!, $period_year: Int, $partial_period_date: String) {
    AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      author
      author_id
      average_time_spent
      total_time_spent
      country_distribution
      exit_page_distribution
      country_wise_city
      medium_distribution
      page_views
      source_distribution
      device_distribution
      readability
      recirculation
      users
      new_users
      period_year
      period_month
    }

    SiteAvg: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(
      where: {
        site_id: { _eq: $site_id },
        period_month: {_eq: $period_month}, period_year: {_eq: $period_year}
      }
    ) {
        recirculation
        readability
    }

    AuthorsDaily:${Reactenv.content_analytics_entity_prefix}authors_daily(where: {author_id: {_eq: $author_id}, period_date: {_like: $partial_period_date}, site_id: {_eq: $site_id}}) {
      medium_distribution
      period_date
      page_views
      users
    }

    AuthorTopMediumMonthly :${Reactenv.content_analytics_entity_prefix}authors_top_medium_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, author: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
        users
        org_id
        author
        refr_medium
        refr_source
        referer_site
        site_id
        created_at
        period_year
        period_month
      }
  }
`;

export const AUTHOR_QUATERLY_DETAILS = `
  query author_quaterly($period_quater: Int, $author_id: String!, $site_id: String!, $period_year: Int, $period_month: [Int]) {
    AuthorsQuaterly:${Reactenv.content_analytics_entity_prefix}authors_quarterly(where: {period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      author
      author_id
      average_time_spent
      total_time_spent
      country_distribution
      exit_page_distribution
      medium_distribution
      page_views
      source_distribution
      device_distribution
      readability
      recirculation
      country_wise_city
      users
      new_users
      period_year
      period_quarter
    }

    SiteAvg: ${Reactenv.content_analytics_entity_prefix}user_analytics_quaterly(
      where: {
        site_id: { _eq: $site_id },
        period_year: {_eq: $period_year}, 
        period_quarter: {_eq: $period_quater}
      }
    ) {
        recirculation
        readability
    }

    AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {author_id: {_eq: $author_id}, period_year: {_eq: $period_year}, period_month: {_in: $period_month}, site_id: {_eq: $site_id}}) {
      medium_distribution
      period_month
      period_year
      page_views
      users
    }

    AuthorsTopMediumQuaterly:${Reactenv.content_analytics_entity_prefix}authors_top_medium_quarterly(where: {period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}, author: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      users
      org_id
      author
      refr_medium
      refr_source
      referer_site
      site_id
      created_at
      period_year
      period_quarter
    }
  }
`;

export const AUTHOR_YEARLY_DETAILS = `
  query author_yearly($author_id: String!, $site_id: String!, $period_year: Int, $site_avg_period_year: Int) {
    AuthorsYearly:${Reactenv.content_analytics_entity_prefix}authors_yearly(where: {period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      author
      author_id
      average_time_spent
      total_time_spent
      country_distribution
      exit_page_distribution
      country_wise_city
      medium_distribution
      recirculation
      readability
      page_views
      source_distribution
      device_distribution
      users
      new_users
      period_year
    }


    SiteAvg: ${Reactenv.content_analytics_entity_prefix}user_analytics_yearly(
      where: {
        site_id: { _eq: $site_id },
        period_year: {_eq: $site_avg_period_year}
      }
    ) {
        recirculation
        readability
    }

    AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {author_id: {_eq: $author_id}, period_year: {_eq: $period_year}, site_id: {_eq: $site_id}}) {
      medium_distribution
      period_month
      period_year
      page_views
      users
    }

    AuthorsTopMediumYearly:${Reactenv.content_analytics_entity_prefix}authors_top_medium_yearly(where: {period_year: {_eq: $period_year}, author: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      users
      org_id
      author
      refr_medium
      refr_source
      referer_site
      site_id
      created_at
      period_year
    }
  }
`;
