// Reports

const GET_TRADEMARK_REPORTS = `
query get_trademark($org_id: Int!, $start_date: date!, $end_date: date!) {
    report: trademark(
      where: { 
        org_id: { _eq: $org_id }, 
        renewal_date: { _gte: $start_date, _lte: $end_date }
      }
    ) {
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

const GET_CONTACT_REPORTS = `
query getContact($org_id: Int!, $start_date: date!, $end_date: date!) {
    report: contact(where: {org_id: {_eq: $org_id}, dsc_renewal_date: {_gte: $start_date, _lte: $end_date}}) {
      id
      email
      name
      phone
      dsc_renewal_date
    }
  }
  
`;

const GET_COMPANY_CONTACT_REPORTS = `
query getCompanyContact($org_id: Int!, $start_date: date!, $end_date: date!,$association: String) {
  report: company_contact(where: {org_id: {_eq: $org_id}, renewal_date: {_gte: $start_date, _lte: $end_date}, association: {_eq: $association}}, order_by: {id: asc}) {
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
    association
  }
}
`;

const GET_TICKET_REPORTS = `
query getTicket($org_id: Int!, $start_date: date!, $end_date: date!) {
    report: ticket(where: {org_id: {_eq: $org_id}, pay_due_date: {_gte: $start_date, _lte: $end_date}}, order_by: {id: asc}) {
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
  GET_TRADEMARK_REPORTS,
  GET_CONTACT_REPORTS,
  GET_COMPANY_CONTACT_REPORTS,
  GET_TICKET_REPORTS,
};
