// Pipelines - Graphql

export const GET_PIPELINES = `
    query($org_id: Int!) {
        pipeline (where:{org_id :{_eq: $org_id}, is_deleted:{_eq: false}}, order_by: {id: desc}) {
            id
            name
            description
            last_ran_at
            status
            created_by
            source{
            id
            name
            image_url
            }
            entities_count
            entities
        }	
    }
`;

export const GET_PIPELINE_VIEW = `
	query($id: Int!, $org_id: Int){
		pipeline (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
			id
			name
			description
			last_ran_at
			created_at
			status
			source {
			  id
			  name
			  image_url
			  app_config
			  entities
			  type
			  connections {
				display_name
				id
			  }
			}
			destination {
				name
			}
			connection {
				id
				display_name
			}
			org {
				external_mapping
			}
			entities
			config
			entities
			sync_from
			sync_frequency
			is_receipe
			connection_id
			transform_url
			transform
			entities_count
			tenant_id
			destination_id
			external_mapping
		}
	}
`;

export const UPDATE_PIPELINE_STATUS_UPDATE = `
	mutation update_pipeline($id: Int!, $status:Boolean!, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {status: $status}) {
			returning{
				id
				status
			}
		}
	}
`;

export const PIPELINE_NAME_UPDATE = `
	mutation update_pipeline($id: Int!, $name: String, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {name: $name}) {
			returning{
				id
				name
			}
		}
	}
`;

export const PIPELINE_DELETE = `
	mutation update_pipeline($id: Int!, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: {is_deleted: true}) {
			returning{
				id
				is_deleted
			}
		}
	}
`;

export const ELT_DESTINATIONS = `
	query getELTDestinations($org_id: Int) {
		organizations(where: {id: {_eq: $org_id}}) {
			external_mapping
		}
	}  
`;

export const GET_ALL_SOURCE = `
    query {
        ref_source (where:{is_source  :{_eq: true}}) {
            description
            group
            name
            image_url
			id
			entities
			connections {
				display_name
				id
			}
        }
    }
`;

export const GET_ALL_DESTINATIONS = `
	query data_source($org_id: Int) {
		data_sources(where: {org_id: {_eq: $org_id}}, order_by: {id: desc_nulls_last}) {
			id
			org_id
		}
	}  
`;

export const PIPELINE_INSERT = `
	mutation insert_pipeline($name: String!, $description: String, $source_id: Int, $entities: jsonb, $org_id: Int, $destination_id: Int, $entities_count: Int) {
		insert_pipeline(objects:
		{
			name: $name,
			description: $description,
			source_id: $source_id,
			tenant_id: 1,
			status: false,
			destination_id: $destination_id,
			config: $entities,
			entities: [],
			sync_from: "",
			sync_frequency: "",
			org_id: $org_id,
			entities_count: $entities_count
		}
		) {
			returning {
				id
				name
				description
				last_ran_at
				status
				org_id
				source {
					id
					name
					image_url
					entities
				}
				config
				entities
				sync_from
				sync_frequency
				entities_count
			}
		}
	}
`;

export const PIPELINE = `
	query($id: Int!, $org_id: Int){
		pipeline (where:{id :{_eq: $id}, org_id:{_eq: $org_id}}) {
			id
			name
			description
			last_ran_at
			status
			source {
			  id
			  name
			  image_url
			  type
			  connections {
				display_name
				id
			  }
			}
			connection {
				display_name
				id
				config
			}
			entities
			config
			entities
			sync_from
			sync_frequency
		}
	}
`;

export const UPDATE_CONNECTION = `
	mutation update_connection($id: Int!, $credentials: jsonb) {
		update_connection(where: {id: {_eq: $id}}, _set: {credentials: $credentials}) {
			returning {
				display_name
				id
				config
			}
		}
	}
`;

export const INSERT_CONNECTION = `
	mutation insert_connection($display_name: String!, $credentials: jsonb, $source_id: Int, $org_id: Int) {
		insert_connection (objects:
		{
			display_name: $display_name,
			credentials: $credentials,
			source_id: $source_id,
			org_id: $org_id
		}
		) {
			returning {
				display_name
				id
			}
		}
	}
`;

export const CONNECTION_PIPELINE_UPDATE = `
	mutation update_pipeline($id: Int!, $connection_id: Int, $org_id: Int) {
		update_pipeline(where: {id:{_eq: $id}, org_id:{_eq: $org_id}}, _set: { connection_id: $connection_id }) {
			returning{
				id
				connection_id
			}
		}
	}
`;
