// Dashboard

const GET_DASHBOARD_DATA = `
query get_dashbaord_data($org_id: Int) {
  company_contact: company_contact(where: {org_id: {_eq: $org_id}}) {
    association
    id
    renewal_date
  }
  trademark: trademark(where: {org_id: {_eq: $org_id}}) {
    renewal_date
    id
    company_id
  }
  contact: contact(where: {org_id: {_eq: $org_id}}) {
    dsc_renewal_date
    id
  }
  ticket: ticket(where: {org_id: {_eq: $org_id}}) {
    pay_due_date
    id
    assignee_id
    status
  }
}
`;

export { GET_DASHBOARD_DATA };
