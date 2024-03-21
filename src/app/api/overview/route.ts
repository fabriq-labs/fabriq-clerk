import axios from "../axios_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  GET_LAST_24_HOURS_ARTICLE_DATA,
  GET_LAST_24HOURS_DATA,
  GET_LAST_24HOURS_DATA_BASED_ON_CATEGORY,
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
      case "getArticleTableList":
        const query = GET_LAST_24_HOURS_ARTICLE_DATA(variables?.period_date);
        result = await makeGraphQLCall(query, {
          site_id: variables?.site_id,
          article_id: variables?.article_id,
        });
        break;
      case "getAuthorTableList":
        const author_query = GET_LAST_24HOURS_DATA(variables?.period_date);
        result = await makeGraphQLCall(author_query, {
          site_id: variables?.site_id,
          author_id: variables?.author_id,
        });
        break;
      case "getCategoryList":
        const category_query = GET_LAST_24HOURS_DATA_BASED_ON_CATEGORY(
          variables?.period_date
        );
        result = await makeGraphQLCall(category_query, {
          site_id: variables?.site_id,
          category: variables?.category,
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
