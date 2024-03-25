export const GET_ORG_INFO = `
  query($id: Int!) {
    organizations(where: {id: {_eq: $id}}) {
      settings
    }
  }
`;