import axios from "../content_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  REALTIMEVISTOR,
  GET_MONTHLY_DATA,
  GET_YEARLY_DATA,
  GET_QUARTERLY_DATA,
  ARTICLE_LIST,
  ARTICLE_DETAILS,
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
      case "getArticleMonthlyDetails":
        result = await makeGraphQLCall(GET_MONTHLY_DATA, variables);
        break;
      case "getArticleQuarterlyDetails":
        result = await makeGraphQLCall(GET_QUARTERLY_DATA, variables);
        break;
      case "getArticleYearlyDetails":
        result = await makeGraphQLCall(GET_YEARLY_DATA, variables);
        break;
      case "getArticleDetails":
        result = await makeGraphQLCall(ARTICLE_DETAILS, variables);
        break;
      case "getRealtimeArticleList":
        result = await makeGraphQLCall(REALTIMEVISTOR, variables);
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
