import axios from "axios";

async function discover_schema(source_id: any, pipeline: any) {
  const body = {
    disable_cache: true,
    sourceId: source_id,
  };

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  return await axios.post(
    `https://cloud.airbyte.com/api/v1/sources/discover_schema`,
    body,
    { headers }
  );
}

async function create_source(config: any, pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  const body: any = {
    workspaceId: pipeline["org"]["external_mapping"]["elt_workspace_id"],
    configuration: config,
    name: `Source created from fabriq pipeline ${pipeline["id"]}`,
  };

  // Check if credentials have a secret_id and add it to the body if present
  if (credentials.secret_id) {
    body.secretId = credentials.secret_id;
  }

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  return await axios.post(
    `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/sources`,
    body,
    { headers }
  );
}

async function update_source(config: any, pipeline: any) {
  const body = {
    configuration: config,
  };

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  return await axios.patch(
    `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/sources/${pipeline["external_mapping"]["elt_source_id"]}`,
    body,
    { headers }
  );
}

async function create_connection(config: any, pipeline: any) {
  const body = {
    sourceId: pipeline["external_mapping"]["elt_source_id"],
    destinationId: config["destinationId"],
    configurations: config["streamsConfig"],
    schedule: {
      scheduleType: "cron",
      cronExpression: "0 0 12 * * ?",
    },
    dataResidency: "auto",
    namespaceDefinition: "destination",
    namespaceFormat: null,
    prefix: "fabriq_",
    nonBreakingSchemaUpdatesBehavior: "ignore",
    name: `Connection created from fabriq pipeline ${pipeline["id"]}`,
  };

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  return await axios.post(
    `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/connections`,
    body,
    { headers }
  );
}

async function create_destionation(
  config: any,
  destination: any,
  organization: any
) {
  const headers = {
    accept: "application/json",
    authorization: `Bearer ${organization["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  const body = {
    workspaceId: organization["external_mapping"]["elt_workspace_id"],
    configuration: config,
    name: `Destionation created from fabriq ${destination?.[0]?.["id"]}`,
  };

  return await axios.post(
    `${organization["external_mapping"]["elt_url"]}/v1/destinations`,
    body,
    { headers }
  );
}

async function update_destination(
  config: any,
  destination: any,
  organization: any,
  existDestinatioId: any
) {
  const headers = {
    accept: "application/json",
    authorization: `Bearer ${organization["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  const body = {
    destinationId: existDestinatioId,
    configuration: config,
    name: `Destination updated from fabriq: ${destination?.[0]?.["id"]}`,
  };

  return await axios.patch(
    `${organization["external_mapping"]["elt_url"]}/v1/destinations/${existDestinatioId}`,
    body,
    { headers }
  );
}

async function update_connection(config: any, pipeline: any) {
  const body = {
    configurations: config["streamsConfig"],
    status: pipeline["status"] === true ? "active" : "inactive",
    namespaceFormat: null,
    schedule: {
      scheduleType: "cron",
      cronExpression: "0 0 12 * * ?",
    },
  };

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
    "content-type": "application/json",
  };

  return await axios.patch(
    `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/connections/${pipeline["external_mapping"]["elt_connection_id"]}`,
    body,
    { headers }
  );
}

const service = {
  do: async function (pipe_event: any, pipeline: any) {
    const event_type = pipe_event["event"]["op"];
    var response;
    switch (event_type) {
      case "SYNC":
        response = await this.sync(pipeline);
        return response.data;
        break;
      case "GET_CONNECTIONS":
        response = await this.get_connections(pipeline);
        return response.data;
        break;
      case "GET_CONNECTION":
        response = await this.get_connection(pipeline);
        return response.data;
        break;
      case "GET_DESTINATIONS":
        response = await this.get_destinations(pipeline);
        return response.data;
        break;
      case "GET_JOBS":
        response = await this.get_jobs(pipeline);
        return response.data;
        break;
      case "OAUTH":
        response = await this.source_oauth(
          pipeline,
          pipe_event["event"]["data"]
        );
        return response.data;
        break;
      case "GET_JOB_INFO":
        response = await this.get_job_info(
          pipeline,
          pipe_event["event"]["data"]["job_id"]
        );
        return response.data;
        break;
      default:
        return {};
    }
  },
  sync: async function (pipeline: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    return await axios.post(
      `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/jobs`,
      {
        jobType: "sync",
        connectionId: pipeline["external_mapping"]["elt_connection_id"],
      },
      {
        headers,
      }
    );
  },
  get_connections: async function (pipeline: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    return await axios.get(
      `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/connections?workspaceIds=${pipeline["org"]["external_mapping"]["elt_workspace_id"]}&includeDeleted=false&limit=10&offset=0`,
      {
        headers,
      }
    );
  },
  get_connection: async function (pipeline: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    return await axios.get(
      `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/connections/${pipeline["external_mapping"]["elt_connection_id"]}`,
      {
        headers,
      }
    );
  },
  get_jobs: async function (pipeline: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    const apiUrl = `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/jobs?connectionId=${pipeline["external_mapping"]["elt_connection_id"]}&limit=10&offset=0`;
    return await axios.get(apiUrl, {
      headers,
    });
  },
  get_destinations: async function (pipeline: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    return await axios.get(
      `${pipeline["org"]["external_mapping"]["elt_url"]}/v1/destinations?workspaceIds=${pipeline["org"]["external_mapping"]["elt_workspace_id"]}&includeDeleted=false&limit=10&offset=0`,
      {
        headers,
      }
    );
  },
  get_job_info: async function (pipeline: any, job_id: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    const body = { jobId: job_id, attemptNumber: 0 };

    return await axios.post(
      "https://cloud.airbyte.com/api/v1/attempt/get_for_job",
      body,
      {
        headers,
      }
    );
  },
  source_oauth: async function (pipeline: any, body: any) {
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${pipeline["org"]["external_mapping"]["auth-token"]}`,
      "content-type": "application/json",
    };

    const config = {
      sourceType: body["type"],
      redirectUrl: body["redirect_url"],
      workspaceId: pipeline["org"]["external_mapping"]["elt_workspace_id"],
      name: body["type"],
      oAuthInputConfiguration: {}
    };

    const baseUrl = pipeline["org"]["external_mapping"]["elt_url"];
    const apiUrl = `${baseUrl}/v1/sources/initiateOAuth`;

    return await axios.post(apiUrl, config, { headers });
  },
};

export {
  discover_schema,
  create_source,
  update_source,
  create_connection,
  update_connection,
  create_destionation,
  update_destination,
  service,
};
