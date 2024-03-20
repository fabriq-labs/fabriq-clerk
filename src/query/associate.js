const INSERT_ASSOCIATE = `
mutation add_associate($company_id: Int!, $appointment_date: date, $association: String, $contact_id: Int, $renewal_date: date, $org_id: Int) {
  insert_company_contact(objects: {company_id: $company_id, appointment_date: $appointment_date, association: $association, contact_id: $contact_id, renewal_date: $renewal_date, org_id: $org_id}) {
    returning {
      id
    }
  }
}
`;

const UPDATE_ASSOCIATE = `
mutation update_associate($id: Int, $set: company_contact_set_input!) {
    update_company_contact(where: {id: {_eq: $id}}, _set: $set) {
      returning {
        id
      }
    }
  }
`;

const DELETE_ASSOCIATE = `
mutation delete_associate($id: Int, $org_id: Int) {
  delete_company_contact(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}) {
    returning {
      id
    }
  }
}
`;

export { UPDATE_ASSOCIATE, INSERT_ASSOCIATE, DELETE_ASSOCIATE };
