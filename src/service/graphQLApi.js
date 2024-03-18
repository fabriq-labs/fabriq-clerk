import axios from "./axios";

const graphQLApi = (query, variables) => {
  return new Promise((resolve, reject) => {
    axios
      .post("", {
        query,
        variables,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default graphQLApi;
