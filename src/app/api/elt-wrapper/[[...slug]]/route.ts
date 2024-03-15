import * as elt from "../../elt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  res: NextResponse,
  { params }: any
) {
  const slug = params?.slug;

  const [endpoint, action]: any = slug;

  const getHandler = (endpoint: any, action: any) => {
    switch (endpoint) {
      case "pipeline":
        if (action === "update") {
          return elt.on_pipeline_event_source;
        }
        break;
      case "sources":
        if (action === "discover_schema") {
          return elt.get_discover_schema;
        }
        break;
      case "connection":
        if (action === "update") {
          return elt.on_pipeline_event_connection;
        }
        break;
      default:
        break;
    }
  };

  const endpointHandler: any = getHandler(endpoint, action);

  if (endpointHandler) {
    return endpointHandler(req, res);
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}
