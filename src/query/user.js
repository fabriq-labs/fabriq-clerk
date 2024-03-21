// User
const INSERT_USER = `
mutation insert_user($email: String, $role: String, $org_id: String,$updated_at: timestamptz, $created_at: timestamptz) {
    insert_user(objects: {email: $email, role: $role, org_id: $org_id, updated_at: $updated_at, created_at: $created_at}) {
      returning {
        id
      }
    }
  }  
`;

export { INSERT_USER };
