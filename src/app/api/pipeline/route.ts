import axios from "../axios_graphql";
import { NextRequest, NextResponse } from "next/server";
import {
  GET_PIPELINES,
  GET_PIPELINE_VIEW,
  UPDATE_PIPELINE_STATUS_UPDATE,
  PIPELINE_NAME_UPDATE,
  PIPELINE_DELETE,
  ELT_DESTINATIONS,
  GET_ALL_SOURCE,
  GET_ALL_DESTINATIONS,
  PIPELINE_INSERT,
  PIPELINE,
  UPDATE_CONNECTION,
  INSERT_CONNECTION,
  CONNECTION_PIPELINE_UPDATE,
} from "./graphql";

// Example function for making a GraphQL call
const makeGraphQLCall = async (query: any, variables: any) => {
  try {
    const response = await axios.post("console/v1/graphql", {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const { operation, variables } = request;
    let result;

    switch (operation) {
      case "getList":
        result = await makeGraphQLCall(GET_PIPELINES, variables);
        break;
      case "getPipelineId":
        result = await makeGraphQLCall(GET_PIPELINE_VIEW, variables);
        break;
      case "updatePipelineStatus":
        result = await makeGraphQLCall(
          UPDATE_PIPELINE_STATUS_UPDATE,
          variables
        );
        break;
      case "updatePipelineName":
        result = await makeGraphQLCall(PIPELINE_NAME_UPDATE, variables);
        break;
      case "deletePipeline":
        result = await makeGraphQLCall(PIPELINE_DELETE, variables);
        break;
      case "deployConnection":
        result = await makeGraphQLCall(ELT_DESTINATIONS, variables);
        break;
      case "getSources":
        result = await makeGraphQLCall(GET_ALL_SOURCE, variables);
        break;
      case "getDatasource":
        result = await makeGraphQLCall(GET_ALL_DESTINATIONS, variables);
        break;
      case "insertPipeline":
        result = await makeGraphQLCall(PIPELINE_INSERT, variables);
        break;
      case "connectionPipeline":
        result = await makeGraphQLCall(PIPELINE, variables);
        break;
      case "updateConnection":
        result = await makeGraphQLCall(UPDATE_CONNECTION, variables);
        break;
      case "insertConnection":
        result = await makeGraphQLCall(INSERT_CONNECTION, variables);
        break;
      case "connectionPipelineUpdate":
        result = await makeGraphQLCall(CONNECTION_PIPELINE_UPDATE, variables);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API request failed:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
