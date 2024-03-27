const INSERT_COMPANY_SHARE = `
mutation add_company_share($company_id: Int!, $appointment_date: date, $association: String, $share_company_id: Int, $renewal_date: date, $org_id: Int, $share: String, $face_value: String, $amount: String) {
    insert_company_share(objects: {company_id: $company_id, appointment_date: $appointment_date, association: $association, share_company_id: $share_company_id, renewal_date: $renewal_date, org_id: $org_id, share: $share, face_value: $face_value, amount: $amount}) {
      returning {
        id
      }
    }
  }  
`;

const UPDATE_COMPANY_SHARE = `
mutation update_company($id: Int, $set: company_share_set_input!) {
  update_company_share(where: {id: {_eq: $id}}, _set: $set) {
    returning {
      id
    }
  }
}
`;

const DELETE_COMPANY_SHARE = `
mutation delete_associate($id: Int, $org_id: Int) {
  delete_company_share(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}) {
    returning {
      id
    }
  }
}
`;

export { INSERT_COMPANY_SHARE, UPDATE_COMPANY_SHARE, DELETE_COMPANY_SHARE };
