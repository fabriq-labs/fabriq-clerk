import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../service/graphQLApi";
import { GET_DASHBOARD_DATA } from "../../../query/dashboard";

export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const org_id =await req.nextUrl.searchParams.get("org_id");
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
