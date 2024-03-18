import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../service/graphQLApi";
import {GET_TICKET, INSERT_TICKET} from "../../../query/ticket";


export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const org_id =req.nextUrl.searchParams.get("org_id");
    const apiResponse = await graphqlApi(GET_TICKET, {
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

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const { variables } : any = data;
    const apiResponse = await graphqlApi(INSERT_TICKET,variables);

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
//   if (req.method === "POST") {
//     const {variables} = req.body;
//     try {
//       const apiResponse = await graphqlApi(INSERT_TICKET, variables);

//       if (apiResponse && apiResponse.data) {
//         res.status(200).json(apiResponse.data);
//       } else {
       
//         console.error("Error response:", apiResponse);
//         res.status(500).json({ error: " Server Error" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: " Server Error" });
//     }
//   } else {
//     try {
//       const { org_id } = req.query;
//       const apiResponse = await graphqlApi(GET_TICKET, {
//         org_id: org_id,
//       });

//       if (apiResponse && apiResponse.data) {
//         res.status(200).json(apiResponse.data);
//       } else {
//         console.error("Error response:", apiResponse);
//         res.status(500).json({ error: "Server Error" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Server Error" });
//     }
//   }
// }
