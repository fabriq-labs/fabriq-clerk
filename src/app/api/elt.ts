import { NextApiRequest, NextApiResponse } from "next";

import * as graphqlApi from "./graphql";
import * as airbyte from "./airbyte";
import * as source_config from "../../utils/elt_source_config";
import * as connection_config from "../../utils/elt_connection_config";

async function get_discover_schema(req: NextApiRequest, res: NextApiResponse) {
  var pipe_event = req.body;
  var pipeline_id = pipe_event["pipelineId"];
  var source_id = pipe_event["sourceId"];
  const pipeline = await graphqlApi.get_pipeline_deep(pipeline_id);

  const ab_response = await airbyte.discover_schema(source_id, pipeline);
  res.send(ab_response?.data);
}

async function on_pipeline_event_source(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var pipe_event = req.body;
  var pipeline_id = pipe_event["event"]["data"]["new"]["id"];
  const pipeline = await graphqlApi.get_pipeline_deep(pipeline_id);
  const event_type = pipe_event["event"]["op"];
  var source_response;
  switch (event_type) {
    case "UPDATE":
      source_response = await upsert_source(pipeline);
      res.send(source_response);
      break;
    case "INSERT":
      source_response = await upsert_source(pipeline);
      res.send(source_response);
      break;
    default:
      res.send(await airbyte.service.do(pipe_event, pipeline));
      break;
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

async function on_pipeline_event_connection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var pipe_event = req.body;
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
      res.send(connection_response);
      break;
    case "INSERT": // else the event is assumed to be a pipeline or connection upsert
      connection_response = await upsert_connection(
        pipeline,
        elt_destination_id
      );
      res.send(connection_response);
      break;
    default:
      res.send(await airbyte.service.do(pipe_event, pipeline));
      break;
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
      // console.log(`connection exists in airbyte: pipeline ${pipeline["external_mapping"]["elt_connection_id"]}`) // Source does not exist in airbyte
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

export {
  get_discover_schema,
  on_pipeline_event_source,
  on_pipeline_event_connection,
};
