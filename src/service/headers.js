let headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.NEXT_PUBLIC_CLERK_ADMIN_KEY,
};

export { headers };
