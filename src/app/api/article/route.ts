import axios from "../content_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  REALTIMEVISTOR,
  GET_LAST_30DAYS_DATA,
  GET_LAST_30DAYS_DATA_FOR_ARTICLE,
  REALTIME_TABLE_FILTER,
  MONTHLY_VISITORS,
  MONTHLY_TABLE_SORT,
  QUARTERLY_VISITORS,
  QUARTERLY_TABLE_SORT,
  YEARLY_VISITORS,
  YEARLY_TABLE_SORT,
} from "./grpahql";

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
      case "getRealtimeArticleList":
        result = await makeGraphQLCall(REALTIMEVISTOR, variables);
        break;
      case "getLast30Days":
        const query = GET_LAST_30DAYS_DATA(variables?.period_date);
        result = await makeGraphQLCall(query, {
          site_id: variables?.site_id,
          article_id: variables?.article_id,
        });
        break;
      case "getLast30DaysArticle":
        const query_ = GET_LAST_30DAYS_DATA_FOR_ARTICLE(variables?.period_date);
        result = await makeGraphQLCall(query_, {
          site_id: variables?.site_id,
          article_id: variables?.article_id,
        });
        break;
      case "getRealTimeFilter":
        variables.filterParams.partial_period_date = `${variables?.period_date}%`;
        const real_time_filer_query = REALTIME_TABLE_FILTER(
          variables.filterParams
        );
        result = await makeGraphQLCall(real_time_filer_query, {
          period_date: variables?.period_date,
          site_id: variables?.site_id,
          offset: variables?.offset,
        });
        break;
      case "getMonthlyVistors":
        result = await makeGraphQLCall(MONTHLY_VISITORS, variables);
        break;
      case "getMonthlyTable":
        const query_monthly = MONTHLY_TABLE_SORT(variables?.filterParams);
        result = await makeGraphQLCall(query_monthly, {
          site_id: variables?.site_id,
          period_month: variables?.period_month,
          period_year: variables?.period_year,
          offset: variables?.offset,
        });
        break;
      case "getQuaterlyVistors":
        result = await makeGraphQLCall(QUARTERLY_VISITORS, variables);
        break;

      case "getQuaterlysort":
        const query_quaterly = QUARTERLY_TABLE_SORT(variables.filterParams);
        result = await makeGraphQLCall(query_quaterly, {
          site_id: variables?.site_id,
          period_quater: variables?.period_quater,
          period_year: variables?.period_year,
          offset: variables?.offset,
        });
        break;
      case "getYearlyVistors":
        const site_avg_period_year = `${variables?.period_year}`;
        result = await makeGraphQLCall(YEARLY_VISITORS, {
          site_id: variables?.site_id,
          period_year: variables?.period_year,
          period_month: variables?.period_month,
          site_avg_period_year,
        });
        break;
      case "getYearlyTable":
        const query_yearly = YEARLY_TABLE_SORT(variables?.filterParams);
        result = await makeGraphQLCall(query_yearly, {
          site_id: variables?.site_id,
          period_year: variables?.period_year,
          offset: variables?.offset,
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
