import axios from "axios";
import { headers } from "./headers";

const URL = process.env.NEXT_PUBLIC_CLERK_BASE_URL;

const instance = axios.create({
  baseURL: URL,
});

instance.defaults.headers.common = headers;

export default instance;
