// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import axios_graphql from "../axios_graphql";

import { ELT_DESTINATIONS } from "../pipeline/graphql";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export async function GET() {
  // Get a cookie
  const token = cookies().get("__session")?.value;
  const decoded = decodeJwt(token);

  // get destination
  const variables = {
    org_id: decoded?.organization?.metadata?.fabriq_org_id,
  };

  try {
    const {
      data: { data, errors },
    } = await axios_graphql.post("console/v1/graphql", {
      query: ELT_DESTINATIONS,
      variables,
    });

    if (errors) {
      throw errors;
    }

    const organization = data?.organizations?.[0];

    // get airbyte destination
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${organization["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    const destination_id =
      organization?.external_mapping?.elt_destination_ids?.[0]
        ?.elt_destination_id;

    const result = await axios.get(
      `${organization["external_mapping"]["elt_url"]}/v1/destinations/${destination_id}`,
      {
        headers,
      }
    );

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
