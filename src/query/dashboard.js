// Dashboard

const GET_DASHBOARD_DATA = `
query get_dashbaord_data($org_id: Int) {
    contact: company_contact(where: {org_id: {_eq: $org_id}}) {
      association
      id
      renewal_date
    }
    trademark: trademark(where: {org_id: {_eq: $org_id}}) {
      renewal_date
      id
      company_id
    }
  }  
`;

export { GET_DASHBOARD_DATA };
