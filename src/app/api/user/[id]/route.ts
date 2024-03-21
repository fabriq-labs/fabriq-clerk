import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../../service/graphQLApi";
import {
    GET_USER_BY_ID,
  UPDATE_USER,
} from "../../../../query/user";

function decodeJwt(token: any) {
    const parts = token?.split(".");
    const payload = parts && JSON.parse(atob(parts?.[1]));
  
    return payload;
  }

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = params;
    // Get a cookie
    const token = cookies().get("__session")?.value;
    const decoded = decodeJwt(token);
    const org_id = decoded?.org_id;
  
    const apiResponse = await graphqlApi(GET_USER_BY_ID, {
      id: parseInt(id as string, 10),
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

export async function PUT(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const { variables } : any = data;
    const apiResponse = await graphqlApi(UPDATE_USER,variables);

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