import axios from "axios";

async function get_pipeline_deep(pipeline_id: number) {
  const query = `
    query getPipeline($pipeline_id: Int!) {
        pipeline_by_pk(id: $pipeline_id) {
          connection {
            credentials
            source_id
            config
          }
          source{
            app_config   
            name         
          }
          org{
            id
            external_mapping
          }
          status
          source_id
          connection_id
          config
          external_mapping
          id
          entities
        }
      }     
    `;

  const variables = {
    pipeline_id,
  };

  const data = await do_graphql(query, variables);
  return data["data"]["pipeline_by_pk"];
}

async function get_sources(connection_id: number) {
  const query = `
    query MyQuery($connection_id: Int!) {
        connection_external_elt_mapping(where: {connection_id: {_eq: $connection_id}}) {
          connection_id
          elt_source_id
          id
        }
      }      
    `;

  const variables = {
    connection_id,
  };

  const data = await do_graphql(query, variables);
  return data;
}

async function do_graphql(query: string, variables: any) {
  const graphql_url = `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}console/v1/graphql`;
  const headers = {
    "content-Type": "application/json",
    "x-hasura-admin-secret": process.env
      .NEXT_PUBLIC_X_HASURA_ADMIN_SECRET as string,
  };

  try {
    const response = await axios.post(
      graphql_url,
      {
        query: query,
        variables: variables,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function update_external_id(mapping: any, pipeline_id: any) {
  const query = `mutation update_pipeline_external_mapping($pipeline_id: Int!, $mapping: jsonb) {
    update_pipeline_by_pk(
      pk_columns: {id: $pipeline_id}
      _set: {external_mapping: $mapping}
    ){
      id
      external_mapping
    }
  }              
                  `;
  const variables = {
    mapping,
    pipeline_id,
  };

  return do_graphql(query, variables);
}

async function create_user(data: any) {
  const query = `mutation insert_users($name: String, $email: String, $api_key: String, $org_id: Int, $updated_at: timestamptz, $created_at: timestamptz) {
    insert_users(objects: {name: $name, email: $email, api_key: $api_key, home_db_slug: "", org_id: $org_id, updated_at: $updated_at, created_at: $created_at}) {
      returning {
        name
        id
      }
    }
  }`;
  const variables = {
    name: data?.name,
    email: data?.email,
    api_key: data?.api_key,
    org_id: data?.org_id,
    updated_at: data?.updated_at,
    created_at: data?.created_at,
  };

  return do_graphql(query, variables);
}

async function delete_user(user_id: any) {
  const query = `mutation delete_users($id: Int) {
    delete_users(where: {id: $id}) {
      returning {
        id
      }
    }
  }
  `;
  const variables = {
    id: user_id,
  };

  return do_graphql(query, variables);
}

export {
  get_pipeline_deep,
  update_external_id,
  delete_user,
  create_user,
};
