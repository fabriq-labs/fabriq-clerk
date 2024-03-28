import { NextRequest, NextResponse } from "next/server";

import * as graphqlApi from "../../graphql";
import * as airbyte from "../../airbyte";
import * as connection_config from "../../../../utils/elt_connection_config";

export async function POST(req: NextRequest) {
  const pipe_event = await req.json();
  var pipeline_id = pipe_event["event"]["data"]["new"]["id"];
  var elt_destination_id = pipe_event["event"]["data"]["elt_destination_id"];
  const pipeline = await graphqlApi.get_pipeline_deep(pipeline_id);
  const event_type = pipe_event["event"]["op"];
  var connection_response;
  switch (event_type) {
    case "UPDATE": // else the event is assumed to be a pipeline or connection upsert
      connection_response = await upsert_connection(
        pipeline,
        elt_destination_id
      );
      return NextResponse.json(connection_response);
    case "INSERT": // else the event is assumed to be a pipeline or connection upsert
      connection_response = await upsert_connection(
        pipeline,
        elt_destination_id
      );
      return NextResponse.json(connection_response);
    default:
      return NextResponse.json(await airbyte.service.do(pipe_event, pipeline));
  }
}

async function upsert_connection(pipeline: any, destination_id: any) {
  if (pipeline["external_mapping"]["elt_connection_id"] == null) {
    try {
      console.log(
        `connection does not exist in airbyte: pipeline ${pipeline["id"]}`
      ); // Source does not exist in airbyte
      const config = connection_config.get_config(pipeline);
      config["sourceId"] = pipeline["external_mapping"]["elt_source_id"];
      if (pipeline["external_mapping"]["elt_destination_id"] != null)
        config["destinationId"] =
          pipeline["external_mapping"]["elt_destination_id"];
      else config["destinationId"] = destination_id;

      // create a connection in airbyte
      const ab_response = await airbyte.create_connection(config, pipeline);
      const elt_connection_id = ab_response.data["connectionId"];
      const elt_destination_id = ab_response.data["destinationId"];
      console.log(`connection created in airbyte: ${elt_connection_id}`);
      const external_mapping = pipeline["external_mapping"];
      external_mapping["elt_connection_id"] = elt_connection_id;
      external_mapping["elt_destination_id"] = elt_destination_id;
      const fabriq_response = await graphqlApi.update_external_id(
        external_mapping,
        pipeline["id"]
      );
      return {
        status: "success",
        url: `https://cloud.airbyte.com/workspaces/${pipeline["org"]["external_mapping"]["elt_workspace_id"]}/connections/${elt_connection_id}`,
        message: `connection ${elt_connection_id} created in airbyte`,
      };
    } catch (error) {
      console.log(`error creating connection in airbyte: ${error}`);
      return {
        status: "error",
        message: `Error creating connection in airbyte: ${error} `,
      };
    }
  } else {
    try {
      const config = connection_config.get_config(pipeline);
      config["connectionId"] =
        pipeline["external_mapping"]["elt_connection_id"];

      // updating a connection in airbyte
      const ab_response = await airbyte.update_connection(config, pipeline);
      console.log(
        `connection ${pipeline["external_mapping"]["elt_connection_id"]} updated in airbyte`
      );
      return {
        status: "success",
        url: `https://cloud.airbyte.com/workspaces/${pipeline["org"]["external_mapping"]["elt_workspace_id"]}/connections/${pipeline["external_mapping"]["elt_connection_id"]}`,
        message: `connection ${pipeline["external_mapping"]["elt_connection_id"]} updated in airbyte`,
      };
    } catch (error) {
      console.log(`error updating connection in airbyte: ${error}`);
      return {
        status: "error",
        message: `Error updating connection in airbyte: ${error} `,
      };
    }
  }
}
