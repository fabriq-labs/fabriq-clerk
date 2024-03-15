import { NextRequest, NextResponse } from "next/server";

import * as graphqlApi from "../../graphql";
import * as airbyte from "../../airbyte";
import * as source_config from "../../../../utils/elt_source_config";

export async function POST(req: NextRequest) {
  const pipe_event = await req.json();
  var pipeline_id = pipe_event["event"]["data"]["new"]["id"];
  const pipeline = await graphqlApi.get_pipeline_deep(pipeline_id);
  const event_type = pipe_event["event"]["op"];
  var source_response;
  switch (event_type) {
    case "UPDATE":
      source_response = await upsert_source(pipeline);
      return NextResponse.json(source_response);
    case "INSERT":
      source_response = await upsert_source(pipeline);
      return NextResponse.json(source_response);
    default:
      return NextResponse.json(await airbyte.service.do(pipe_event, pipeline));
  }
}

async function upsert_source(pipeline: any) {
  const config = source_config.get_source_config(pipeline);

  if (pipeline["external_mapping"]["elt_source_id"] != null) {
    try {
      // update a source in airbyte
      const ab_response = await airbyte.update_source(config, pipeline);
      console.log(
        `source updated in airbyte: ${pipeline["external_mapping"]["elt_source_id"]}`
      );
      return {
        status: "success",
        message: `source ${pipeline["external_mapping"]["elt_source_id"]} updated in airbyte`,
      };
    } catch (error) {
      return {
        status: "error",
        message: `Error updating source in airbyte: ${error} `,
      };
    }
  } else {
    console.log(`source does not exist in airbyte: pipeline ${pipeline["id"]}`); // Source does not exist in airbyte
    try {
      // create a source in airbyte
      const ab_response = await airbyte.create_source(config, pipeline);
      const elt_source_id = ab_response.data["sourceId"];
      console.log(`source created in airbyte: ${elt_source_id}`);
      const external_mapping = pipeline["external_mapping"];
      external_mapping["elt_source_id"] = elt_source_id;
      const fabriq_response = await graphqlApi.update_external_id(
        external_mapping,
        pipeline["id"]
      );
      console.log(
        `source created in airbyte: pipeline ${pipeline["id"]} airbyte source id: ${elt_source_id}`
      );
      return {
        status: "success",
        message: `source ${elt_source_id} created in airbyte`,
      };
    } catch (error) {
      console.log(`error creating source in airbyte: ${error}`);
      return {
        status: "error",
        message: `Error creating source in airbyte: ${error} `,
      };
    }
  }
}
