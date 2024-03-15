// Axios Api
import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}`,
});

instance.defaults.headers.common = {
  "content-Type": "application/json",
  "x-hasura-admin-secret": process.env
    .NEXT_PUBLIC_X_HASURA_ADMIN_SECRET as string,
};

export default instance;
