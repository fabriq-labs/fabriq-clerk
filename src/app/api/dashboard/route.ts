import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../service/graphQLApi";
import { GET_DASHBOARD_DATA } from "../../../query/dashboard";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export async function GET(
  req: NextRequest
) {
  try {
       // Get a cookie
    // const token = cookies().get("__session")?.value;
    // const decoded = decodeJwt(token);
    const org_id = "1";
    const apiResponse = await graphqlApi(GET_DASHBOARD_DATA, {
      org_id: org_id,
    });

    if (apiResponse && apiResponse.data) {
      return NextResponse.json(apiResponse.data);
    } else {
      console.error("Error response:", apiResponse);
      return NextResponse.json({ error: "Server Error" });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server Error" });
  }
}
