import axios from "../content_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  AUTHOR_REAL_TIME_DETAILS,
  AUTHOR_YEARLY_DETAILS,
  AUTHOR_QUATERLY_DETAILS,
  AUTHOR_MONTHLY_DETAILS,
} from "./graphql";
import {
  AUTHORS_MONTHLY,
  AUTHORS_QUARTERLY,
  AUTHORS_YEARLY,
  GET_LAST_30DAYS_DATA_AUTHOR,
  getAuthorBasedArticleList,
  getAuthorBasedArticleListForMonthly,
  getAuthorBasedArticleListForQuarterly,
  getAuthorBasedArticleListForYearly,
  getAuthorBasedArticleListRealTime,
} from "./authors_list_graphql";
import { GET_LAST_24HOURS_DATA } from "../overview/graphql";

// Example function for making a GraphQL call
const makeGraphQLCall = async (query: any, variables: any) => {
  try {
    const response = await axios.post("/v1/graphql", {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const { operation, variables } = request;
    let result;
    switch (operation) {
      case "getAuthorMonthlyDetails":
        result = await makeGraphQLCall(AUTHOR_MONTHLY_DETAILS, variables);
        break;
      case "getAuthorQuarterDetails":
        result = await makeGraphQLCall(AUTHOR_QUATERLY_DETAILS, variables);
        break;
      case "getAuthorYearDetails":
        const site_avg_period_year = `${variables?.period_year}`;
        result = await makeGraphQLCall(AUTHOR_YEARLY_DETAILS, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          period_year: variables?.period_year,
          site_avg_period_year,
        });
        break;
      case "getAuthorRealTimeList":
        result = await makeGraphQLCall(AUTHOR_REAL_TIME_DETAILS, variables);
        break;
      case "getArticlesList":
        const getArticlesListquery: any = getAuthorBasedArticleList(
          variables?.orderBy?.field,
          variables?.orderBy?.direction
        );
        result = await makeGraphQLCall(getArticlesListquery, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          limit: variables?.limit,
          offset: variables?.offset,
        });
        break;
      case "getArticlesListRealTime":
        const getArticlesListRealTime = getAuthorBasedArticleListRealTime(
          variables?.orderBy?.field,
          variables?.orderBy?.direction
        );
        result = await makeGraphQLCall(getArticlesListRealTime, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          limit: variables?.limit,
          offset: variables?.offset,
          period_date: variables?.period_date,
          partical_period_date: variables?.partical_period_date,
        });
        break;
      case "getArticlesListMonthly":
        const getArticlesListMonthlyquery = getAuthorBasedArticleListForMonthly(
          variables?.orderBy?.field,
          variables?.orderBy?.direction
        );
        result = await makeGraphQLCall(getArticlesListMonthlyquery, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          limit: variables?.limit,
          offset: variables?.offset,
          period_month: variables?.period_month,
          period_year: variables?.period_year,
          startOfMonth: variables?.startOfMonth,
          startOfNextMonth: variables?.startOfNextMonth,
        });
        break;
      case "getArticlesListQuarterly":
        const getArticlesListQuarterly = getAuthorBasedArticleListForQuarterly(
          variables?.orderBy?.field,
          variables?.orderBy?.direction
        );
        result = await makeGraphQLCall(getArticlesListQuarterly, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          limit: variables?.limit,
          offset: variables?.offset,
          period_quarter: variables?.period_quarter,
          period_year: variables?.period_year,
          startOfQuarter: variables?.startOfQuarter,
          startOfNextQuarter: variables?.startOfNextQuarter,
        });
        break;
      case "getArticlesListYearly":
        const getArticlesListYearly = getAuthorBasedArticleListForYearly(
          variables?.orderBy?.field,
          variables?.orderBy?.direction
        );
        result = await makeGraphQLCall(getArticlesListYearly, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
          limit: variables?.limit,
          offset: variables?.offset,
          period_year: variables?.period_year,
          startOfYear: variables?.startOfYear,
          startOfNextYear: variables?.startOfNextYear,
        });
        break;
      case "get_authors_monthly":
        result = await makeGraphQLCall(AUTHORS_MONTHLY, variables);
        break;
      case "get_authors_quarterly":
        result = await makeGraphQLCall(AUTHORS_QUARTERLY, variables);
        break;
      case "get_authors_yearly":
        result = await makeGraphQLCall(AUTHORS_YEARLY, variables);
        break;
      case "getLast24HoursForAuthor":
        const getLast24HoursForAuthor = GET_LAST_24HOURS_DATA(
          variables?.period_date
        );
        result = await makeGraphQLCall(getLast24HoursForAuthor, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
        });
        break;
      case "getLast30DaysForAuthor":
        const getLast30DaysForAuthor = GET_LAST_30DAYS_DATA_AUTHOR(
          variables?.period_date
        );
        result = await makeGraphQLCall(getLast30DaysForAuthor, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API request failed:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
