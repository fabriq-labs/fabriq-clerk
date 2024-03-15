import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export async function POST(req: NextRequest) {
  const { id, reqdata } = await req.json();

  // Get a cookie
  const token = cookies().get("__session")?.value;
  const decoded = decodeJwt(token);

  const headers = {
    "META-KEY": `${token}`,
    "Content-Type": "application/json",
  };

  // try {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/connection/${id}`,
    reqdata,
    {
      headers,
    }
  );

  if (response.data && response.data.status && response.data.message) {
    // Return the main API response
    return NextResponse.json(response.data, { status: 200 });
  } else {
    // If the response structure is unexpected, handle it accordingly
    console.error("Unexpected API Response Structure");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
