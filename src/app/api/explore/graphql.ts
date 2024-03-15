export const CHAT_TYPES = `
query {
  org_chat_models_mapping {
    id
      chat_model {
        id
        name
        type
      }
      
    }
  }  
`;

export const GET_CHAT_RESULT_LIST = `
  query getChatResultList($org_id: Int!) {
    chat_results(where: {org_id: {_eq: $org_id}}, order_by: {id: desc}) {
      id
      question
    }
  }
`;

export const UPDATE_CHAT_RESULT = `
  mutation UpdateChatReslut($id: Int!, $data: jsonb, $org_id: Int!, $query: String, $question: String, $name: String) {
    update_chat_results(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}, _set: {data: $data, query: $query, question: $question, name: $name}) {
      returning {
        id
        question
      }
    }
  }
`;

export const INSERT_CHAT_RESULTS = `
  mutation InsertChatResults($chat_model_id: Int!, $data: jsonb, $data_source_id: Int!, $org_id: Int!, $query: String, $question: String, $name: String) {
    insert_chat_results(objects: {chat_model_id: $chat_model_id, data: $data, data_source_id: $data_source_id, org_id: $org_id, query: $query, question: $question, name: $name}) {
      returning {
        id
        query_id
        question
      }
    }
  }
`;

export const GET_CHAT_RESULT_BY_ID = `
  query getChatResultById($org_id: Int!, $id: Int!) {
    chat_results(where: {org_id: {_eq: $org_id}, id: {_eq: $id}}) {
      id
      name
      question
      chat_model_id
      data
      data_source_id
      message
      query
    }
  }
`;

