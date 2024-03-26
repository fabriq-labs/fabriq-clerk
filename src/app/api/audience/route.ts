import axios from "../content_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  USER_ANALYTICS_DAILY,
  USER_ANALYTICS_MONTHLY,
  USER_ANALYTICS_QUATERLY,
  USER_ANALYTICS_YEARLY,
} from "./graphql";

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
      case "getUserDaily":
        result = await makeGraphQLCall(USER_ANALYTICS_DAILY, variables);
        break;
      case "getUserMonthly":
        result = await makeGraphQLCall(USER_ANALYTICS_MONTHLY, variables);
        break;
      case "getUserQuaterly":
        result = await makeGraphQLCall(USER_ANALYTICS_QUATERLY, variables);
        break;
      case "getUserYearly":
        result = await makeGraphQLCall(USER_ANALYTICS_YEARLY, {
          site_id: variables?.site_id,
          period_year: variables?.period_year,
          monthly_year: parseInt(variables?.period_year),
          period_month: variables?.period_month,
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
