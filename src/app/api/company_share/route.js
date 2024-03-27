import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../service/graphQLApi";
import {
  INSERT_COMPANY_SHARE,
  UPDATE_COMPANY_SHARE,
  DELETE_COMPANY_SHARE,
} from "../../../query/company_share";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { variables }: any = data;
    const apiResponse = await graphqlApi(INSERT_COMPANY_SHARE, variables);

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

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { variables }: any = data;
    const apiResponse = await graphqlApi(UPDATE_COMPANY_SHARE, variables);

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

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { variables }: any = data;

    // console.log("DELETE", org_id,id);

    const apiResponse = await graphqlApi(DELETE_COMPANY_SHARE, variables);

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
