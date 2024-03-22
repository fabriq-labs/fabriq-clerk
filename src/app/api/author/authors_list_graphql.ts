import { periodDateFormation, Reactenv } from "@/utils/helper";

const AUTHOR_LIST = `
  query author_List($site_id: String!, $period_month: Int, $period_year: Int, $offset: Int!) {
    Authors:${Reactenv.content_analytics_entity_prefix}authors(where: {site_id: {_eq: $site_id}}, limit: 10, offset: $offset, order_by: {published_articles: desc}) {
      author_id
      name
      published_articles
      authors_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, site_id: {_eq: $site_id}}) {
        author_id
        average_time_spent
        total_time_spent
        recirculation
      }
    }
    totalCount:${Reactenv.content_analytics_entity_prefix}authors_aggregate(where: {site_id: {_eq: $site_id}}) {
      aggregate {
        count
      }
    }
  }
`;

function getAuthorBasedArticleList(orderByField: any, orderByDirection: any) {
  const query = `
    query article_List($site_id: String!, $author_id: String!, $limit: Int, $offset: Int) {
      Articles:${Reactenv.content_analytics_entity_prefix}top_articles_by_author(
        limit: $limit
        offset: $offset
        where: { site_id: { _eq: $site_id }, author_id: { _eq: $author_id } }
        order_by: { ${orderByField}: ${orderByDirection} }
      ) {
        author_id
        article_id
        page_views
        users
        title
        published_date
        category
        author
      }
  
      totalCount:${Reactenv.content_analytics_entity_prefix}top_articles_by_author_aggregate(where: { site_id: { _eq: $site_id }, author_id: { _eq: $author_id } }) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
}

const AUTHORS_REALTIME = `
  query author_List($site_id: String!, $period_date: String, $offset: Int, $partical_period_date: String) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}, order_by: {total_time_spent: desc_nulls_last}, limit: 10, offset: $offset) {
      author_id
      author
      average_time_spent
      total_time_spent
      recirculation
      readability
      period_date
      published_articles: articles_aggregate(where: {site_id: {_eq: $site_id}, published_date: {_like: $partical_period_date}}) {
        aggregate {
          count
        }
      }
    }
    totalCount:${Reactenv.content_analytics_entity_prefix}authors_daily_aggregate(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
      aggregate {
        count
      }
    }
  }

`;

const AUTHORS_LIST = `
  query author_List($site_id: String!, $period_date: String, $offset: Int!, $partial_period_date: String) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}, limit: 10, offset: $offset, order_by: {total_time_spent: desc_nulls_last}) {
      author_id
      author
      average_time_spent
      total_time_spent
      recirculation
      readability
      period_date
      totalCount: articles_aggregate(where: {site_id: {_eq: $site_id}, published_date: {_like: $partial_period_date}}) {
        aggregate {
          count
        }
      }
    }
  }
`;

const AUTHORS_MONTHLY = `
  query author_List($site_id: String!, $period_month: Int, $period_year: Int, $offset: Int!, $startOfMonth: String, $startOfNextMonth: String) {
    Authors:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, limit: 10, offset: $offset, order_by: {total_time_spent: desc_nulls_last}) {
      author_id
      author
      average_time_spent
      total_time_spent
      recirculation
      readability
      period_year
      period_month
      published_articles: articles_aggregate(where: {published_date: {_gte: $startOfMonth, _lt: $startOfNextMonth}}) {
        aggregate {
          count
        }
      }
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}authors_monthly_aggregate(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}){
      aggregate {
        count
      }
    }
  }
`;

const AUTHORS_QUARTERLY = `
  query author_List($site_id: String!, $period_quarter: Int, $period_year: Int, $offset: Int!, $startOfQuarter: String, $startOfNextQuarter: String) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors_quarterly(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}}, limit: 10, offset: $offset, order_by: {total_time_spent: desc_nulls_last}) {
      author_id
      author
      average_time_spent
      total_time_spent
      recirculation
      readability
      period_year
      period_quarter
      published_articles: articles_aggregate(where: {site_id: {_eq: $site_id}, published_date: {_gte: $startOfQuarter, _lt: $startOfNextQuarter}}) {
        aggregate {
          count
        }
      }
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}authors_quarterly_aggregate(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}}){
      aggregate {
        count
      }
    }
  }
`;

const AUTHORS_YEARLY = `
  query author_List($site_id: String!, $period_year: Int, $offset: Int!, $startOfYear: String, $startOfNextYear: String) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors_yearly(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}, limit: 10, offset: $offset, order_by: {total_time_spent: desc_nulls_last}) {
      author_id
      author
      average_time_spent
      total_time_spent
      recirculation
      readability
      period_year
      published_articles: articles_aggregate(where: {site_id: {_eq: $site_id}, published_date: {_gte: $startOfYear, _lt: $startOfNextYear}}) {
        aggregate {
          count
        }
      }
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}authors_yearly_aggregate(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}){
      aggregate {
        count
      }
    }
  }
`;

function getAuthorBasedArticleListForMonthly(orderByField: any, orderByDirection: any) {
  let order_by = `order_by: { ${orderByField}: ${orderByDirection} }`;

  const query = `
    query article_List($site_id: String!, $period_month: Int, $period_year: Int, $author_id: String!, $limit: Int, $offset: Int, $startOfMonth: String, $startOfNextMonth: String) {
      Articles: ${Reactenv.content_analytics_entity_prefix}author_monthly_performance_view(limit: $limit, offset: $offset, where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, published_date: {_gte: $startOfMonth, _lt: $startOfNextMonth}, site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}, ${order_by}) {
        article_id
        author_id
        title
        category
        period_month
        period_year
        author
        page_views
        users
        published_date
      }
      ArticleCount: ${Reactenv.content_analytics_entity_prefix}articles_aggregate(where: {published_date: {_gte: $startOfMonth, _lt: $startOfNextMonth}, site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
}

function getAuthorBasedArticleListForQuarterly(orderByField: any, orderByDirection: any) {
  let order_by = `order_by: { ${orderByField}: ${orderByDirection} }`;

  const query = `
    query article_List($site_id: String!, $period_quarter: Int, $period_year: Int, $author_id: String!, $limit: Int, $offset: Int, $startOfQuarter: String, $startOfNextQuarter: String) {
      Articles: ${Reactenv.content_analytics_entity_prefix}author_quarterly_performance_view(limit: $limit, offset: $offset, ${order_by}, where: {period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}, published_date: {_gte: $startOfQuarter, _lt: $startOfNextQuarter}, site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}) {
        article_id
        author_id
        title
        category
        period_quarter
        period_year
        author
        page_views
        users
        published_date
      }
      ArticleCount: ${Reactenv.content_analytics_entity_prefix}articles_aggregate(
        where: {
         published_date: {_gte: $startOfQuarter, _lt: $startOfNextQuarter},
          author_id: {_eq: $author_id},
          site_id: {_eq: $site_id}
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
}

function getAuthorBasedArticleListForYearly(orderByField: any, orderByDirection: any) {
  let order_by = `order_by: { ${orderByField}: ${orderByDirection} }`;

  const query = `
    query article_List($site_id: String!, $period_year: Int, $author_id: String!, $limit: Int, $offset: Int, $startOfYear: String, $startOfNextYear: String) {
      Articles: ${Reactenv.content_analytics_entity_prefix}author_yearly_performance_view(limit: $limit, offset: $offset, ${order_by}, where: {period_year: {_eq: $period_year}, published_date: {_gte: $startOfYear, _lt: $startOfNextYear} ,site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}) {
        article_id
        author_id
        title
        category
        period_year
        author
        page_views
        users
        published_date
      }
      ArticleCount: ${Reactenv.content_analytics_entity_prefix}articles_aggregate(
        where: {
         published_date: {_gte: $startOfYear, _lt: $startOfNextYear},
          author_id: {_eq: $author_id}
          site_id: {_eq: $site_id}
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
}

function getAuthorBasedArticleListRealTime(orderByField: any, orderByDirection: any) {
  let order_by = `order_by: { ${orderByField}: ${orderByDirection} }`;

  const query = `
    query article_List($site_id: String!, $period_date: String, $author_id: String!, $limit: Int, $offset: Int, $partical_period_date: String) {
      Articles: ${Reactenv.content_analytics_entity_prefix}author_daily_performance_view(limit: $limit, offset: $offset, ${order_by},
        where: {
        author_id: {_eq: $author_id},
        site_id: {_eq: $site_id},
        period_date: {_eq: $period_date},
        published_date: {_like: $partical_period_date}
      }) {
        article_id
        author_id
        title
        category
        period_date
        author
        page_views
        users
        published_date
      }
      ArticleCount: ${Reactenv.content_analytics_entity_prefix}articles_aggregate(
        where: {
          published_date: {_like: $partical_period_date},
          author_id: {_eq: $author_id},
          site_id: {_eq: $site_id}
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
}
const GET_LAST_30DAYS_DATA_AUTHOR = (period_date: any) => {
  const start_date = periodDateFormation(period_date, "days", "YYYY-MM-DD");
  const obj = `
    where: {
      period_date: { _gte: "${start_date}" }
      site_id: { _eq: $site_id }
      author_id: { _in: $author_id }
    }
`;

  const query = `
    query overViewData($site_id: String!, $author_id: [String!]) {
      last30DaysDataForAuthor:${Reactenv.content_analytics_entity_prefix}authors_daily(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        author_id
      }
    }
`;

  return query;
};
export {
  AUTHOR_LIST,
  getAuthorBasedArticleList,
  AUTHORS_LIST,
  AUTHORS_MONTHLY,
  getAuthorBasedArticleListForMonthly,
  AUTHORS_QUARTERLY,
  getAuthorBasedArticleListForQuarterly,
  AUTHORS_YEARLY,
  getAuthorBasedArticleListForYearly,
  AUTHORS_REALTIME,
  getAuthorBasedArticleListRealTime,
  GET_LAST_30DAYS_DATA_AUTHOR
};
