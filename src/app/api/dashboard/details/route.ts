import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../../service/graphQLApi";

import {
  GET_TRADEMARK_LIST,
  GET_CONTACT_LIST,
  GET_TICKET,
  GET_COMPANY_CONTACT,
} from "../../../../query/dashboard";

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json();
    const org_id = "1";

    const query =
      event?.type === "Trademark Renewal(s)"
        ? GET_TRADEMARK_LIST
        : event?.type === "DSC"
        ? GET_CONTACT_LIST
        : event?.type === "Pay Later"
        ? GET_TICKET
        : GET_COMPANY_CONTACT;

    console.log("id", event);

    const apiResponse = await graphqlApi(query, {
      ids: event.id,
      org_id: parseInt(org_id as string, 10),
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
