import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import graphqlApi from "../../../../service/graphQLApi";
import {
  GET_CONTACT_BY_ID,
  UPDATE_CONTACT,
  DELETE_CONTACT,
} from "../../../../query/contact";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export async function GET(req: NextRequest, { params }: any) {
  try {
    // const org_id = await req.nextUrl.searchParams.get("org_id");
    const { id } = params;

    // Get a cookie
    // const token = cookies().get("__session")?.value;
    // const decoded = decodeJwt(token);
    const org_id = "1";

    const apiResponse = await graphqlApi(GET_CONTACT_BY_ID, {
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

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { variables }: any = data;
    const apiResponse = await graphqlApi(UPDATE_CONTACT, variables);

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

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const { id } = params;
    // const org_id = req.nextUrl.searchParams.get("org_id");

     // Get a cookie
     const token = cookies().get("__session")?.value;
     const decoded = decodeJwt(token);
     const org_id = "1";

    const apiResponse = await graphqlApi(DELETE_CONTACT, {
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

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "GET") {
//     const { id, org_id } = req.query;

//     try {
//       const apiResponse = await graphqlApi(GET_CONTACT_BY_ID, {
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
//   } else if (req.method === "PUT") {
//     const { variables } = req.body;
//     try {
//       const apiResponse = await graphqlApi(UPDATE_CONTACT, variables);

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
//     const { id, org_id } = req.query;
//     try {
//       const apiResponse = await graphqlApi(DELETE_CONTACT, {
//         id: parseInt(id as string, 10),
//         org_id: parseInt(org_id as string, 10),
//       });

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