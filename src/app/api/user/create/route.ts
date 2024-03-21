import axios from "axios";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../../service/graphQLApi";
import { INSERT_USER } from "../../../../query/user";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const evt: WebhookEvent = body;
    if (evt.type === "user.created") {
      const userId = evt.data.id;
      const user = evt.data;

      const organization_memberships = await axios.get(
        `https://api.clerk.com/v1/users/${userId}/organization_memberships`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );
      const email = user?.email_addresses?.[0]?.email_address;
      const currentDate = new Date();
      const currentTimestamp = currentDate.toISOString();
      const reqData: any = {
        email: email,
        role: organization_memberships?.data?.data?.[0]?.role,
        org_id: organization_memberships?.data?.data?.[0]?.organization?.id,
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
      };

      const apiResponse = await graphqlApi(INSERT_USER, reqData);

      if (apiResponse && apiResponse.data) {
        return NextResponse.json(apiResponse.data);
      } else {
        console.error("Error response:", apiResponse);
        return NextResponse.json({ error: "Server Error" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server Error" });
  }
}
