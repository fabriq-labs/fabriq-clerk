import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../../service/graphQLApi";
import {
  GET_TRADEMARK_BY_ID,
  UPDATE_TRADEMARK,
} from "../../../../query/trademark";

export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const org_id =req.nextUrl.searchParams.get("org_id");
    const id = req.nextUrl.searchParams.get("id");
  
    const apiResponse = await graphqlApi(GET_TRADEMARK_BY_ID, {
      id: parseInt(id as string, 10),
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

export async function PUT(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const { variables } : any = data;
    const apiResponse = await graphqlApi(UPDATE_TRADEMARK,variables);

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
//   if (req.method === "GET") {
//     const { id, org_id } = req.query;

//     try {
//       const apiResponse = await graphqlApi(GET_TRADEMARK_BY_ID, {
//         id: parseInt(id as string, 10),
//         org_id: parseInt(org_id as string, 10),
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
//   } else {
//     const { variables } = req.body;
//     try {
//       const apiResponse = await graphqlApi(UPDATE_TRADEMARK, variables);

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
//   }
// }
