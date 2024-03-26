import axios from "../axios_graphql";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  GET_ORG_INFO,
} from "./graphql";


function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}



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
    const token = cookies().get("__session")?.value;
    const decoded = decodeJwt(token);

    const request = await req.json();
    const { operation, variables } = request;
    let result;
    switch (operation) {
      case "getOrgSettings":
          result = await makeGraphQLCall(GET_ORG_INFO, {
            id: await decoded?.organization?.metadata?.fabriq_org_id,
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
