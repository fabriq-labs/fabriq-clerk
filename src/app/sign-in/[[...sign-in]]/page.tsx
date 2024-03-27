"use client";

import { SignIn } from "@clerk/nextjs";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    localStorage.removeItem("site_details");
    localStorage.removeItem("sites");
    localStorage.removeItem("org_settings");
  }, []);
  return (
    <div className="signin-container">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
