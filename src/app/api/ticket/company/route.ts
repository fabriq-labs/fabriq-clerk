import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../../service/graphQLApi";
import { GET_COMPANY_DETAILS } from "../../../../query/ticket";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}


export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  try {
    // const org_id =await req.nextUrl.searchParams.get("org_id");
    const org_id = "1";
    const apiResponse = await graphqlApi(GET_COMPANY_DETAILS, {
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

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { org_id } = req.query;

//   try {
//     const apiResponse = await graphqlApi(GET_COMPANY_DETAILS, {
//       org_id: parseInt(org_id as string, 10),
//     });

//     if (apiResponse && apiResponse.data) {
//       res.status(200).json(apiResponse.data);
//     } else {
//       console.error("Error response:", apiResponse);
//       res.status(500).json({ error: "Server Error" });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server Error" });
//   }
// }
