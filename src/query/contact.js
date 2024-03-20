// Contact Query

const GET_CONTACT = `
query getContact($org_id: Int!) {
    contact: contact(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
      id  
      email
      name
      phone
      email
    }
    company: company(where: {org_id: {_eq: $org_id}}) {
      id
      name
    }
  }  
`;

const INSERT_CONTACT = `
mutation insert_contact($aadhar: String, $alternate_email: String, $din: String, $dsc_registered_date: date, $dsc_renewal_date: date, $email: String, $name: String, $org_id: Int, $pan: String, $passport: String, $phone: String, $reference: String, $whatsapp: String, $salutation: String, $tag: String) {
  insert_contact(objects: {aadhar: $aadhar, alternate_email: $alternate_email, din: $din, dsc_registered_date: $dsc_registered_date, dsc_renewal_date: $dsc_renewal_date, email: $email, name: $name, org_id: $org_id, pan: $pan, passport: $passport, phone: $phone, reference: $reference, whatsapp: $whatsapp, salutation: $salutation, tag: $tag}) {
    returning {
      id
      name
      type
    }
  }
}
`;

const UPDATE_CONTACT = `
mutation update_contact($id: Int!, $set: contact_set_input!) {
  contact: update_contact(where: { id: { _eq: $id } }, _set: $set) {
    returning {
      id
      name
      type
    }
  }
}
`;

const GET_CONTACT_BY_ID = `
query get_contact_by_id($org_id: Int, $id: Int) {
  contact: contact(where: {id: {_eq: $id}}) {
    reference
    phone
    passport
    pan
    org_id
    name
    email
    id
    dsc_renewal_date
    dsc_registered_date
    din
    alternate_email
    aadhar
    whatsapp
    type
    salutation
    tag
  }
  associate: company_contact(where: {org_id: {_eq: $org_id}, contact_id: {_eq: $id}}) {
    association
    company_id
    contact_id
    id
    renewal_date
    appointment_date
    company {
      name
    }
  }
  company: company(where: {org_id: {_eq: $org_id}}, order_by: {id: asc}) {
    id
    name
  }
}  
`;

const DELETE_CONTACT = `
mutation delete_contact($id: Int!, $org_id: Int) {
  delete_contact(where: {id: {_eq: $id}, org_id: {_eq: $org_id}}) {
    returning {
      id
    }
  }
}
`;

export {
  GET_CONTACT,
  INSERT_CONTACT,
  UPDATE_CONTACT,
  GET_CONTACT_BY_ID,
  DELETE_CONTACT,
};
