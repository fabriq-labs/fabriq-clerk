// User
const INSERT_USER = `
mutation insert_user($email: String, $role: String, $org_id: String,$updated_at: timestamptz, $created_at: timestamptz) {
    insert_user(objects: {email: $email, role: $role, org_id: $org_id, updated_at: $updated_at, created_at: $created_at}) {
      returning {
        id
      }
    }
  }  
`;

const GET_USER = `
query get_user($org_id: String) {
  user: user(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
    email
    name
    phone
    id
    role
  }
}
`;

const UPDATE_USER = `
mutation update_user($id: Int!, $set: user_set_input!) {
  user: update_user(where: {id: {_eq: $id}}, _set: $set) {
    returning {
      id
      email
    }
  }
}
`;

const GET_USER_BY_ID = `
query get_user($org_id: String, $id: Int) {
  user: user(where: {org_id: {_eq: $org_id}, id: {_eq: $id}}) {
    email
    name
    phone
    id
    role
    alternate_phone
  }
}
`;

export { INSERT_USER, GET_USER, UPDATE_USER, GET_USER_BY_ID };
