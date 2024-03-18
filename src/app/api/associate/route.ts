import { NextRequest, NextResponse } from "next/server";
import graphqlApi from "../../../service/graphQLApi";
import {
  INSERT_ASSOCIATE,
  UPDATE_ASSOCIATE,
  DELETE_ASSOCIATE,
} from "../../../query/associate";

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const { variables } : any = data;
    const apiResponse = await graphqlApi(INSERT_ASSOCIATE,variables);

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
    const apiResponse = await graphqlApi(UPDATE_ASSOCIATE,variables);

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

export async function DELETE(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const { variables } : any = data;

    // console.log("DELETE", org_id,id);
  
    const apiResponse = await graphqlApi(DELETE_ASSOCIATE, variables);

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
//     const { variables } = req.body;
//     try {
//       const apiResponse = await graphqlApi(INSERT_ASSOCIATE, variables);

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
//   } else if (req.method === "PUT") {
//     const { variables } = req.body;
//     try {
//       const apiResponse = await graphqlApi(UPDATE_ASSOCIATE, variables);

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
//     const { variables } = req.body;
//     try {
//       const apiResponse = await graphqlApi(DELETE_ASSOCIATE,variables);

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
