import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";

import { user_create_query, get_groups, get_sites } from "../graphql";

function generateToken(length: any) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = new Array(length)
    .fill(null)
    .map(() => chars[Math.floor(Math.random() * chars.length)]);

  const token = rand.join("");
  return token;
}

const makeGraphQLCall = async (query: any, variables: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}console/v1/graphql`,
      {
        query,
        variables,
      },
      {
        headers: {
          "content-Type": "application/json",
          "x-hasura-admin-secret": process.env
            .NEXT_PUBLIC_X_HASURA_ADMIN_SECRET as string,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error.message);

    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const evt = (await req.json()) as WebhookEvent;

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
      const email = user.email_addresses[0].email_address;
      const currentDate = new Date();
      const currentTimestamp = currentDate.toISOString();

      const groups_response = await makeGraphQLCall(get_groups, {
        org_id: parseInt(
          organization_memberships?.data?.data?.[0]?.organization
            ?.public_metadata?.fabriq_org_id
        ),
      });

      const sites_response = await makeGraphQLCall(get_sites, {
        org_id: parseInt(
          organization_memberships?.data?.data?.[0]?.organization
            ?.public_metadata?.fabriq_org_id
        ),
      });

      const groups = `{${groups_response?.data?.groups
        ?.map((item: any) => item.id)
        .join(", ")}}`;
      const sites = `{${sites_response?.data?.sites
        ?.map((item: any) => item.id)
        .join(", ")}}`;

      const token = generateToken(40);
      const reqData: any = {
        api_key: token,
        email: email,
        name: `${userId}`,
        org_id: parseInt(
          organization_memberships?.data?.data?.[0]?.organization
            ?.public_metadata?.fabriq_org_id
        ),
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
        sites: sites,
        groups: groups,
      };

      const fabriq_response = await makeGraphQLCall(user_create_query, reqData);
      if (fabriq_response?.data?.insert_users?.returning?.[0]?.id) {
        return NextResponse.json(
          { message: "User created Successfully." },
          { status: 200 }
        );
      } else {
        const errorMessage =
          fabriq_response?.data?.errors?.[0]?.message ||
          "User creation failed.";
        return NextResponse.json({ message: errorMessage }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { message: "Unhandled webhook event type." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
