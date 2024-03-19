// Ticket Query
const GET_TICKET = `
query get_ticket($org_id: Int) {
  ticket: ticket(where: {org_id: {_eq: $org_id}}, order_by: {id: desc}) {
    assignee_id
    company_id
    id
    status
    subject
    priority
    company {
      id
      name
    }
  }
}
`;

const INSERT_TICKET = `
mutation insert_ticket($assignee_id: Int, $company_id: Int, $contact_id: jsonb, $description: String, $org_id: Int, $status: String, $subject: String, $type: String, $tag: String, $comment: String, $due_date: String, $pay_due_date: String,$priority: String) {
  insert_ticket(objects: {assignee_id: $assignee_id, company_id: $company_id, contact_id: $contact_id, description: $description, org_id: $org_id, status: $status, subject: $subject, type: $type, tag: $tag, comment: $comment, due_date: $due_date, pay_due_date: $pay_due_date, priority: $priority}) {
    returning {
      id
      subject
    }
  }
}
`;

const UPDATE_TICKET = `
mutation update_ticket($id: Int!, $set: ticket_set_input!) {
  ticket: update_ticket(where: {id: {_eq: $id}}, _set: $set) {
    returning {
      id
      subject
    }
  }
}
`;

const GET_TICKET_BY_ID = `
query get_ticket_by_id($id: Int, $org_id: Int) {
  ticket: ticket(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}) {
    assignee_id
    comment
    company_id
    contact_id
    description
    id
    status
    subject
    type
    tag
    due_date
    pay_due_date
    priority
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

const GET_COMPANY_DETAILS = `
query getCompanyDetails($org_id: Int) {
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
  GET_TICKET,
  INSERT_TICKET,
  UPDATE_TICKET,
  GET_TICKET_BY_ID,
  GET_COMPANY_DETAILS,
};
