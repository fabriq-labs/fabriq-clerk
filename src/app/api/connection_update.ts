// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import axios from "axios";

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const cookies = new Cookies(req, res);
  const { id, reqdata } = req.body;

  // Get a cookie
  const token = cookies.get("__session");
  const decoded = decodeJwt(token);

  const headers = {
    "META-KEY": `${token}`,
    "Content-Type": "application/json",
  };

  // try {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/connection/${id}`,
    reqdata,
    {
      headers,
    }
  );

  if (response.data && response.data.status && response.data.message) {
    // Return the main API response
    res.status(response.status).json(response.data);
  } else {
    // If the response structure is unexpected, handle it accordingly
    console.error("Unexpected API Response Structure");
    res
      .status(500)
      .json({ status: "error", message: "Unexpected response structure" });
  }
}
