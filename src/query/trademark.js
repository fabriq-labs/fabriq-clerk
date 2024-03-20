// Trademark Query
const GET_TRADEMARK = `
query get_trademark($org_id: Int) {
  trademark: trademark(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
    company_id
    renewal_date
    registered_date
    id
    brand_name
    company {
      id
      name
    }
  }
}
`;

const INSERT_TRADEMARK = `
mutation insert_trademark($brand_name: String, $company_id: Int, $contact_id: jsonb, $org_id: Int, $registered_date: date, $renewal_date: date, $tag: String) {
  insert_trademark(objects: {brand_name: $brand_name, company_id: $company_id, contact_id: $contact_id, org_id: $org_id, registered_date: $registered_date, renewal_date: $renewal_date, tag: $tag}) {
    returning {
      id
      brand_name
    }
  }
}
`;

const UPDATE_TRADEMARK = `
mutation update_trademark($id: Int!, $set: trademark_set_input!) {
    trademark: update_trademark(where: {id: {_eq: $id}}, _set: $set) {
      returning {
        id
        brand_name
      }
    }
  }
`;

const GET_TRADEMARK_BY_ID = `
query get_trademark_by_id($org_id: Int, $id: Int) {
  trademark:trademark(where: {org_id: {_eq: $org_id}, id: {_eq: $id}}) {
    company_id
    contact_id
    id
    registered_date
    renewal_date
    tag
    brand_name
  }
   company: company(where: {org_id: {_eq: $org_id}}) {
    id
    name
    company {
      contact {
        id
        name
      }
    }
  }
}
`;

export {
  GET_TRADEMARK,
  INSERT_TRADEMARK,
  UPDATE_TRADEMARK,
  GET_TRADEMARK_BY_ID,
};
