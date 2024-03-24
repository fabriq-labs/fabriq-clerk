import axios from "../axios_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  REVENUE_ANALYTICS,
  OVERALLDATA,
  ADVERTISER_MONTHLY,
  get_main_list,
  GET_MAIN_LIST_CHART,
  get_overall_data,
  GET_SUB_LIST,
  GET_SUB_LIST_CHART,
  REVENUE_ANALYTICS_MONTHLY,
  OVERALLDATA_QUARTERLY,
  get_main_list_quarterly,
  GET_MAIN_LIST_CHART_QUARTERLY,
  GET_SUB_LIST_CHART_QUARTERLY,
  ADVERTISER_QUARTERLY,
  get_overall_data_quarterly,
  GET_SUB_LIST_QUARTERLY,
  REVENUE_ANALYTICS_YEARLY,
  OVERALLDATA_YEARLY,
  get_main_list_yearly,
  GET_MAIN_LIST_CHART_YEARLY,
  ADVERTISER_YEARLY,
  get_overall_data_yearly,
  GET_SUB_LIST_YEARLY,
  GET_SUB_LIST_CHART_YEARLY,
} from "./graphql";

// Example function for making a GraphQL call
const makeGraphQLCall = async (query: any, variables: any) => {
  try {
    const response = await axios.post("console/v1/graphql", {
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
      case "getRevenue":
        result = await makeGraphQLCall(REVENUE_ANALYTICS, variables);
        break;
      case "getOverall":
        result = await makeGraphQLCall(OVERALLDATA, variables);
        break;
      case "getAdvertiserMonthly":
        result = await makeGraphQLCall(ADVERTISER_MONTHLY, variables);
        break;
      case "getMontlyMainList":
        const query = get_main_list(variables?.filterParams);
        result = await makeGraphQLCall(query, {
          offset: variables?.offset,
          period_month: variables?.period_month,
          period_year: variables?.period_year,
          sortOrder: variables?.sortOrder,
        });
        break;
      case "getMainChart":
        result = await makeGraphQLCall(GET_MAIN_LIST_CHART, variables);
        break;
      case "getOverallFilter":
        const queryfilter = get_overall_data(variables?.filterConditons);

        result = await makeGraphQLCall(queryfilter, {
          period_month: variables?.period_month,
          period_year: variables?.period_year,
        });
        break;
      case "getMonthlySubList":
        result = await makeGraphQLCall(GET_SUB_LIST, variables);
        break;
      case "getMonthlySubListChart":
        result = await makeGraphQLCall(GET_SUB_LIST_CHART, variables);
        break;
      case "getRevenueMonthly":
        result = await makeGraphQLCall(REVENUE_ANALYTICS_MONTHLY, variables);
        break;
      case "getRevenueOverallQuaterly":
        result = await makeGraphQLCall(OVERALLDATA_QUARTERLY, variables);
        break;
      case "getQuaterlyMainList":
        const quarter_query = get_main_list_quarterly(variables?.filterParams);
        result = await makeGraphQLCall(quarter_query, {
          offset: variables?.offset,
          period_quarter: variables?.period_quarter,
          period_year: variables?.period_year,
          sortOrder: variables?.sortOrder,
        });
        break;
      case "getMainChartQuarterly":
        result = await makeGraphQLCall(
          GET_MAIN_LIST_CHART_QUARTERLY,
          variables
        );
        break;
      case "getAdvertiserQuaterly":
        result = await makeGraphQLCall(ADVERTISER_QUARTERLY, variables);
        break;
      case "getOverallFilterQuaterly":
        const queryfilterQuaterly = get_overall_data_quarterly(
          variables?.filterConditons
        );

        result = await makeGraphQLCall(queryfilterQuaterly, {
          period_quarter: variables?.period_quarter,
          period_year: variables?.period_year,
        });
        break;
      case "getQuaterlySubList":
        result = await makeGraphQLCall(GET_SUB_LIST_QUARTERLY, variables);
        break;
      case "getQuaterlySubListChart":
        result = await makeGraphQLCall(GET_SUB_LIST_CHART_QUARTERLY, variables);
        break;
      case "getRevenueYearly":
        result = await makeGraphQLCall(REVENUE_ANALYTICS_YEARLY, variables);
        break;
      case "getRevenueYearlyOverall":
        result = await makeGraphQLCall(OVERALLDATA_YEARLY, variables);
        break;
      case "getYearlyMainList":
        const year_query = get_main_list_yearly(variables?.filterParams);
        result = await makeGraphQLCall(year_query, {
          offset: variables?.offset,
          period_year: variables?.period_year,
          sortOrder: variables?.sortOrder,
        });
        break;
      case "getRevenueYearlyMainChart":
        result = await makeGraphQLCall(GET_MAIN_LIST_CHART_YEARLY, variables);
        break;
      case "getAdvertiserYearly":
        result = await makeGraphQLCall(ADVERTISER_YEARLY, variables);
        break;
      case "getOverallFilterYearly":
        const queryfilterYearly = get_overall_data_yearly(
          variables?.filterConditons
        );

        result = await makeGraphQLCall(queryfilterYearly, {
          period_year: variables?.period_year,
        });
        break;
      case "getYearlySubList":
        result = await makeGraphQLCall(GET_SUB_LIST_YEARLY, variables);
        break;
      case "getYearlySubListChart":
        result = await makeGraphQLCall(GET_SUB_LIST_CHART_YEARLY, variables);
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
