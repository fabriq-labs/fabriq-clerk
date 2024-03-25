import { periodDateFormation, Reactenv } from "@/utils/helper";

export const GET_LAST_24_HOURS_ARTICLE_DATA = (period_date: any) => {
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

export const GET_LAST_24HOURS_DATA = (period_date: any) => {
  const twentyFourHoursAgo = periodDateFormation(
    period_date,
    "hours",
    "YYYY-MM-DD"
  );
  const obj = `
      where: {
        period_date: { _gte: "${twentyFourHoursAgo}", _lte: "${period_date}" }
        site_id: { _eq: $site_id }
        author_id: { _in: $author_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $author_id: [String!]!) {
      last24HoursData:${Reactenv.content_analytics_entity_prefix}authors_hourly(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        author_id
        period_hour
      }
    }
  `;

  return query;
};
export const GET_ORG_INFO = `
  query($id: Int!) {
    organizations(where: {id: {_eq: $id}}) {
      settings
    }
  }
`;
export const GET_LAST_24HOURS_DATA_BASED_ON_CATEGORY = (period_date: any) => {
  const twentyFourHoursAgo = periodDateFormation(
    period_date,
    "hours",
    "YYYY-MM-DD"
  );
  const obj = `
      where: {
        period_date: { _gte: "${twentyFourHoursAgo}", _lte: "${period_date}" }
        site_id: { _eq: $site_id }
        category: { _in: $category }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $category: [String!]!) {
      last24HoursData:${Reactenv.content_analytics_entity_prefix}articles_hourly_with_category_wise_view (
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        category
        hour
      }
    }
  `;
  

  return query;
};
