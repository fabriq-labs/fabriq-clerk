// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export async function GET(req: NextRequest, { params }: any) {
  const slug = params?.slug;

  // Get a cookie
  const token = cookies().get("__session")?.value;
  const decoded = decodeJwt(token);

  const headers = {
    "META-KEY": `${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/jobs/${slug}`,
      {
        headers,
      }
    );

    return NextResponse.json(response?.data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
