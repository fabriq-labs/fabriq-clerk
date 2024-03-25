import { Reactenv, periodDateFormation } from "@/utils/helper";

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

export const GET_LAST_30DAYS_DATA = (period_date: any) => {
  const twentyFourHoursAgo = periodDateFormation(
    period_date,
    "hours",
    "YYYY-MM-DD"
  );
  const obj = `
      where: {
        period_date: { _gte: "${twentyFourHoursAgo}", _lte: "${period_date}" }
        site_id: { _eq: $site_id }
        article_id: { _in: $article_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $article_id: [String!]!) {
      last30DaysData:${Reactenv.content_analytics_entity_prefix}articles_hourly(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        hour
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
    }
  `;

  return query;
};

export const GET_LAST_30DAYS_DATA_FOR_ARTICLE = (period_date: any) => {
  const start_date = periodDateFormation(period_date, "days", "YYYY-MM-DD");

  const obj = `
      where: {
        period_date: { _gte: "${start_date}" }
        site_id: { _eq: $site_id }
        article_id: { _in: $article_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $article_id: [String!]!) {
      last30DaysData:${Reactenv.content_analytics_entity_prefix}articles_daily(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
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
    }
  `;

  return query;
};

const getTotalArticlesQuery = (filterParams: any) => {
  const { partial_period_date, filter_field, filter_value } = filterParams;

  const filterClauses = [];

  filterClauses.push(`period_date: { _eq: $period_date }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `authors: {
        name: {
          _eq: "${filter_value}"
        }
      }`;
    } else {
      articleFilter = `${filter_field}: {
        _eq: "${filter_value}"
      }`;
    }

    if (filter_field === "published_date") {
      filterClauses.push(`article: {
        published_date: {
          _like: "${filter_value}"
        }
      }`);
    } else {
      filterClauses.push(`article: {
        ${articleFilter},
        published_date: {
          _like: "${partial_period_date}"
        }
      }`);
    }
  } else {
    filterClauses.push(`article: {
      published_date: {
        _like: "${partial_period_date}"
      }
    }`);
  }

  const filterClause = filterClauses.join(",\n");

  const query = `
    total_articles: ${Reactenv.content_analytics_entity_prefix}articles_daily_aggregate(
      where: {
        ${filterClause}
      }
    ) {
      aggregate {
        count
      }
    }
  `;

  return query;
};

export const REALTIME_TABLE_FILTER = (filterParams: any) => {
  const { partial_period_date, filter_field, filter_value, order_by } =
    filterParams;

  const filterClauses = [];

  filterClauses.push(`period_date: { _eq: $period_date }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  // Add a filter clause for the specified filter_field and filter_value
  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `authors: {
        name: {
          _eq: "${filter_value}"
        }
      }`;
    } else {
      articleFilter = `${filter_field}: {
        _eq: "${filter_value}"
      }`;
    }

    if (filter_field === "published_date") {
      filterClauses.push(`article: {
        published_date: {
          _like: "${filter_value}"
        }
      }`);
    } else {
      filterClauses.push(`article: {
        ${articleFilter},
        published_date: {
          _like: "${partial_period_date}"
        }
      }`);
    }
  } else {
    filterClauses.push(`article: {
      published_date: {
        _like: "${partial_period_date}"
      }
    }`);
  }

  const filterClause = filterClauses.join(",\n");

  const orderByClause = order_by
    ? `order_by: {
        ${order_by?.field}: ${order_by?.direction}
      }`
    : "";

  const obj = `
    limit: 10, offset: $offset, where: {
      ${filterClause}
    }, ${orderByClause}
  `;

  const totalArticlesQuery = getTotalArticlesQuery(filterParams);

  const query = `
    query realtime_table_list($period_date: String!, $site_id: String!, $offset: Int!) {
      ${totalArticlesQuery}
      real_time_sort: ${Reactenv.content_analytics_entity_prefix}articles_daily(${obj}) {
        users
        total_time_spent
        site_id
        average_time_spent
        attention_time
        valid_play_views
        recirculation
        scroll_depth {
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
        }
        article {
          article_id
          title
          category
          published_date
          authors {
            name
            author_id
          }
        }
        page_views
      }
    }
  `;

  return query;
};

export const MONTHLY_VISITORS = `
  query monthly_visitors($site_id: String!, $period_month: Int, $period_year: Int, $partial_period_date: String) {
    monthly_visitor_daily: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(where: {site_id: {_eq: $site_id}, period_date: {_like: $partial_period_date}}, order_by: {period_date: asc}) {
      attention_time
      page_views
      period_date
      users
    }
    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
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
    monthly_visitors: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      page_views
      users
      attention_time
      period_year
      total_time_spent
      average_time_spent
    }
  }
`;

const getMonthlyTableTotalCountQuery = (filterParams: any) => {
  const { filter_field, filter_value } = filterParams;

  const filterClauses = [];

  filterClauses.push(`period_month: { _eq: $period_month }`);
  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `article: {
        authors: {
          name: {
            _eq: "${filter_value}"
          }
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `article: {
        published_date: {
          _like: "${filter_value}"
        }
      }`;
    } else {
      articleFilter = `article: {
        ${filter_field}: {
          _eq: "${filter_value}"
        }
      }`;
    }

    filterClauses.push(articleFilter);
  }

  const filterClause = filterClauses.join(",\n");

  const query = `
  total_articles: ${Reactenv.content_analytics_entity_prefix}articles_monthly_aggregate(
      where: {
        ${filterClause}
      }
    ) {
      aggregate {
        count
      }
    }
  `;

  return query;
};

export const MONTHLY_TABLE_SORT = (filterParams: any) => {
  const { order_by, filter_field, filter_value } = filterParams;

  const filterClauses = [];

  filterClauses.push(`period_month: { _eq: $period_month }`);
  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `authors: {
        name: {
          _eq: "${filter_value}"
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `${filter_field}: {
        _like: "${filter_value}"
      }`;
    } else {
      articleFilter = `${filter_field}: {
        _eq: "${filter_value}"
      }`;
    }

    filterClauses.push(`article: {
          ${articleFilter},
        }`);
  }

  const filterClause = filterClauses.join(",\n");

  const orderByClause = order_by
    ? `order_by: {
        ${order_by.field}: ${order_by.direction}
      }`
    : "";

  const obj = `
    limit: 10, offset: $offset, where: {
      ${filterClause}
    }, ${orderByClause}
  `;

  const totalArticlesCountQuery = getMonthlyTableTotalCountQuery(filterParams);

  const query = `
    query monthly_table_sort($site_id: String!, $period_month: Int, $period_year: Int, $offset: Int!) {
      ${totalArticlesCountQuery}
      monthly_data: ${Reactenv.content_analytics_entity_prefix}articles_monthly(${obj}) {
        users
        attention_time
        average_time_spent
        total_time_spent
        valid_play_views
        recirculation
        scroll_depth {
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
        }
        article {
          article_id
          category
          title
          published_date
          authors {
            author_id
            name
          }
        }
        page_views
      }
    }
  `;

  return query;
};

export const QUARTERLY_VISITORS = `
  query quaterly_visitors($site_id: String!, $period_quater: Int, $period_year: Int, $period_month: [Int]) {
    quarterly_visitors: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_year:  {_eq: $period_year}, period_month: {_in: $period_month}}) {
        attention_time
        page_views
        users
        period_month
      }
      TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}}) {
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
      quarterly_visitors_list: ${Reactenv.content_analytics_entity_prefix}user_analytics_quaterly(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}}) {
        attention_time
        page_views
        users
        total_time_spent
        average_time_spent
      }
    }
`;

const getQuarterlyTableTotalCountQuery = (filterParams: any) => {
  const { filter_field, filter_value } = filterParams;

  const filterClauses = [];

  filterClauses.push(`period_quarter: { _eq: $period_quater }`);
  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `article: {
        authors: {
          name: {
            _eq: "${filter_value}"
          }
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `article: {
        published_date: {
          _like: "${filter_value}"
        }
      }`;
    } else {
      articleFilter = `article: {
        ${filter_field}: {
          _eq: "${filter_value}"
        }
      }`;
    }

    filterClauses.push(articleFilter);
  }

  const filterClause = filterClauses.join(",\n");

  const query = `
  total_articles: ${Reactenv.content_analytics_entity_prefix}articles_quarterly_aggregate(
      where: {
        ${filterClause}
      }
    ) {
      aggregate {
        count
      }
    }
  `;

  return query;
};


export const QUARTERLY_TABLE_SORT = (filterParams: any) => {
  const { order_by, filter_field, filter_value } = filterParams;

  const orderByClause = order_by
    ? `order_by: {
        ${order_by.field}: ${order_by.direction}
      }`
    : "";

  const filterClauses = [];

  filterClauses.push(`period_quarter: { _eq: $period_quater }`);
  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `authors: {
        name: {
          _eq: "${filter_value}"
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `${filter_field}: {
        _like: "${filter_value}"
      }`;
    } else {
      articleFilter = `${filter_field}: {
        _eq: "${filter_value}"
      }`;
    }

    filterClauses.push(`article: {
          ${articleFilter},
        }`);
  }

  const filterClause = filterClauses.join(",\n");

  const obj = `
  limit: 10, offset: $offset, where: {
    ${filterClause}
  }, ${orderByClause}
`;

  const totalArticlesQuery = getQuarterlyTableTotalCountQuery(filterParams);

  const query = `
    query quarterly_table_sort($site_id: String!, $period_quater: Int, $period_year: Int, $offset: Int) {
      ${totalArticlesQuery}
      quarterly_data: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(${obj}) {
        users
        attention_time
        average_time_spent
        total_time_spent
        valid_play_views
        recirculation
        scroll_depth {
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
        }
        article {
          article_id
          category
          title
          published_date
          authors {
            author_id
            name
          }
        }
        page_views
      }
    }
  `;

  return query;
};

export const YEARLY_VISITORS = `
  query yearly_visitors($site_id: String!, $period_year: Int, $period_month: [Int], $site_avg_period_year: Int) {
    yearly_list_data: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_year:  {_eq: $period_year}, period_month: {_in: $period_month}}) {
      attention_time
      page_views
      users
      period_month
      period_year
    }
    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
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
    yearly_list: ${Reactenv.content_analytics_entity_prefix}user_analytics_yearly(where: {site_id: {_eq: $site_id}, period_year: {_eq: $site_avg_period_year}}) {
      attention_time
      page_views
      users
      total_time_spent
      average_time_spent
    }
  }
`;

const getYearlyTableTotalCountQuery = (filterParams: any) => {
  const { filter_field, filter_value } = filterParams;

  const filterClauses = [];

  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `article: {
        authors: {
          name: {
            _eq: "${filter_value}"
          }
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `article: {
        published_date: {
          _like: "${filter_value}"
        }
      }`;
    } else {
      articleFilter = `article: {
        ${filter_field}: {
          _eq: "${filter_value}"
        }
      }`;
    }

    filterClauses.push(articleFilter);
  }

  const filterClause = filterClauses.join(",\n");

  const query = `
  total_articles: ${Reactenv.content_analytics_entity_prefix}articles_yearly_aggregate(
      where: {
        ${filterClause}
      }
    ) {
      aggregate {
        count
      }
    }
  `;

  return query;
};

export const YEARLY_TABLE_SORT = (filterParams: any) => {
  const { order_by, filter_field, filter_value } = filterParams;

  const orderByClause = order_by
    ? `order_by: {
        ${order_by.field}: ${order_by.direction}
      }`
    : "";

  const filterClauses = [];

  filterClauses.push(`period_year: { _eq: $period_year }`);
  filterClauses.push(`site_id: { _eq: $site_id }`);

  if (filter_field && filter_value) {
    let articleFilter;

    if (filter_field === "name") {
      articleFilter = `authors: {
        name: {
          _eq: "${filter_value}"
        }
      }`;
    } else if (filter_field === "published_date") {
      articleFilter = `${filter_field}: {
        _like: "${filter_value}"
      }`;
    } else {
      articleFilter = `${filter_field}: {
        _eq: "${filter_value}"
      }`;
    }

    filterClauses.push(`article: {
          ${articleFilter},
        }`);
  }

  const filterClause = filterClauses.join(",\n");

  const obj = `
  limit: 10, offset: $offset, where: {
    ${filterClause}
  }, ${orderByClause}
`;

  const totalArticlesQuery = getYearlyTableTotalCountQuery(filterParams);

  const query = `
    query yearly_table_sort($site_id: String!, $period_year: Int, $offset: Int) {
      ${totalArticlesQuery}
      yearly_data: ${Reactenv.content_analytics_entity_prefix}articles_yearly(${obj}) {
        users
        attention_time
        average_time_spent
        total_time_spent
        valid_play_views
        recirculation
        scroll_depth {
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
        }
        article {
          article_id
          category
          title
          published_date
          authors {
            author_id
            name
          }
        }
        page_views
      }
    }
  `;

  return query;
};
