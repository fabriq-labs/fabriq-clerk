const GET_COMPANY = `
query getCompany($org_id: Int!) {
  company: company(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
    name
    type
    country
    id
  }
}
`;

const INSERT_COMPANY = `
mutation insert_company($cin: String, $city: String, $incorporation_date: String, $name: String, $org_id: Int, $state: String, $type: String, $country: String, $pincode: String, $address_line_1: String, $address_line_2: String, $account_owner: Int, $total_share: bigint, $paid_up_capital: bigint, $authorized_capital: bigint, $email: String, $rd_office: String, $roc: String, $status: String, $tag: String, $agm_date: date, $balancesheet_date: date) {
  insert_company(objects: {cin: $cin, city: $city, incorporation_date: $incorporation_date, name: $name, org_id: $org_id, state: $state, type: $type, country: $country, pincode: $pincode, address_line_1: $address_line_1, address_line_2: $address_line_2, account_owner: $account_owner, total_share: $total_share, paid_up_capital: $paid_up_capital, authorized_capital: $authorized_capital, email: $email, rd_office: $rd_office, roc: $roc, status: $status, tag: $tag, agm_date: $agm_date, balancesheet_date: $balancesheet_date}) {
    returning {
      id
      name
    }
  }
}
`;

const GET_COMPANY_BY_ID = `
query get_company_by_id($org_id: Int, $id: Int) {
  company: company(where: {id: {_eq: $id}}) {
    type
    cin
    city
    country
    created_at
    incorporation_date
    name
    id
    state
    org_id
    pincode
    address_line_1
    address_line_2
    account_owner
    authorized_capital
    total_share
    paid_up_capital
    email
    rd_office
    roc
    status
    tag
    agm_date
    balancesheet_date
  }
  associate: company_contact(where: {org_id: {_eq: $org_id}, company_id: {_eq: $id}}, order_by: {id: asc}) {
    association
    company_id
    contact_id
    id
    renewal_date
    appointment_date
    share
    face_value
    amount
    contact {
      name
    }
  }
  contact: contact(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
    id
    name
  }
  companyList: company(where: {org_id: {_eq: $org_id}}) {
    type
    cin
    city
    country
    created_at
    incorporation_date
    name
    id
    state
    org_id
    pincode
    address_line_1
    address_line_2
    account_owner
    authorized_capital
    total_share
    paid_up_capital
    email
    rd_office
    roc
    status
    tag
    agm_date
    balancesheet_date
  }
  company_share: company_share(where: {company_id: {_eq: $id}}) {
    renewal_date
    share
    share_company_id
    id
    company_id
    association
    appointment_date
    face_value
    amount
    company {
      id
      name
    }
  }
}
`;

const UPDATE_COMPANY = `
mutation update_company($id: Int!, $set: company_set_input!) {
  company: update_company(where: { id: { _eq: $id } }, _set: $set) {
    returning {
      id
      name
      type
    }
  }
}
`;

const DELETE_COMPANY = `
mutation delete_company($id: Int!, $org_id: Int) {
  delete_company(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}) {
    returning {
      id
    }
  }
}
`;

export {
  GET_COMPANY,
  INSERT_COMPANY,
  GET_COMPANY_BY_ID,
  UPDATE_COMPANY,
  DELETE_COMPANY,
};
