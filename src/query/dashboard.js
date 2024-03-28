// Dashboard

const GET_DASHBOARD_DATA = `
query get_dashbaord_data {
  company_contact: company_contact {
    association
    id
    renewal_date
  }
  trademark: trademark {
    renewal_date
    id
    company_id
  }
  contact: contact {
    dsc_renewal_date
    id
  }
  ticket: ticket {
    pay_due_date
    id
    assignee_id
    status
    priority
    service_type
  }
  user: user {
    email
    name
    phone
    id
    role
  }
}
`;

const GET_TRADEMARK_LIST = `
query get_trademark($org_id: Int, $ids: [Int!]) {
  associate: trademark(where: { org_id: { _eq: $org_id }, id: { _in: $ids } }) {
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

const GET_CONTACT_LIST = `
query getContact($org_id: Int!, $ids: [Int!]) {
  associate: contact(where: {org_id: {_eq: $org_id},  id: {_in: $ids}}, order_by: {id: asc}) {
    id
    email
    name
    phone
    dsc_renewal_date
  }
}
`;

const GET_COMPANY_CONTACT = `
query getCompanyContact($org_id: Int!, $ids: [Int!]) {
  associate: company_contact(where: {org_id: {_eq: $org_id}, id: {_in: $ids}}, order_by: {id: asc}) {
    id
    company_id
    contact_id
    renewal_date
    company {
      name
    }
    contact {
      name
    }
  }
}
`;

const GET_TICKET = `
query getTicket($org_id: Int!, $ids: [Int!]) {
  associate: ticket(where: {org_id: {_eq: $org_id}, id: {_in: $ids}}, order_by: {id: asc}) {
    id
    pay_due_date
    subject
    assignee_id
    company {
      name
    }
  }
}
`;

export {
  GET_DASHBOARD_DATA,
  GET_TRADEMARK_LIST,
  GET_CONTACT_LIST,
  GET_COMPANY_CONTACT,
  GET_TICKET,
};
