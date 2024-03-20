import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../service/graphQLApi";

import {
  GET_TRADEMARK_REPORTS,
  GET_CONTACT_REPORTS,
  GET_TICKET_REPORTS,
  GET_COMPANY_CONTACT_REPORTS,
} from "../../../query/reports";

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json();
    const org_id = 1;

    const query =
      event?.type === "Trademark Renewal(s)"
        ? GET_TRADEMARK_REPORTS
        : event?.type === "DSC"
        ? GET_CONTACT_REPORTS
        : event?.type === "Pay Later"
        ? GET_TICKET_REPORTS
        : GET_COMPANY_CONTACT_REPORTS;

    let variables = { ...event.variables, org_id };

    const apiResponse = await graphqlApi(query, variables);

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
