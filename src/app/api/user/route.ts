import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../service/graphQLApi";
import { GET_USER } from "../../../query/user";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get a cookie
    const token = cookies().get("__session")?.value;
    const decoded = decodeJwt(token);
    // const org_id = decoded?.org_id;
    const org_id = "org_2eDgJQWGJ0biBmIlgS7hBnzOI9n"
    const apiResponse = await graphqlApi(GET_USER, {
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
