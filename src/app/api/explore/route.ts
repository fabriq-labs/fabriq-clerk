import axios from "../axios_graphql";
import { NextRequest, NextResponse } from "next/server";

import {
  CHAT_TYPES,
  GET_CHAT_RESULT_LIST,
  UPDATE_CHAT_RESULT,
  INSERT_CHAT_RESULTS,
  GET_CHAT_RESULT_BY_ID,
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
      case "getChatType":
        result = await makeGraphQLCall(CHAT_TYPES, variables);
        break;
      case "getChatResult":
        result = await makeGraphQLCall(GET_CHAT_RESULT_LIST, variables);
        break;
      case "updateResult":
        result = await makeGraphQLCall(UPDATE_CHAT_RESULT, variables);
        break;
      case "insertChatResult":
        result = await makeGraphQLCall(INSERT_CHAT_RESULTS, variables);
        break;
      case "getChatResultById":
        result = await makeGraphQLCall(GET_CHAT_RESULT_BY_ID, variables);
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
