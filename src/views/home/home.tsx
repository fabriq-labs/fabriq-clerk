"use client";

import React, { useEffect, useState } from "react";
import { Protect, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Overview } from "@views/overview/overview";
import OverviewPage from "@views/overview/overview_main";
import Layout from "@components/layout";
import axios from "axios";

export default function HomePage() {
  const { has } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canManage = has && has({ permission: "org:feature:protected" });
  const getSites = () => {
    axios
      .post("/api/sites", {})
      .then((result) => {
        let resultData = result?.data;
        localStorage.setItem("sites", JSON.stringify(resultData));
        localStorage.setItem("site_details", JSON.stringify(resultData[0]))
          if (canManage) {
            router.push("/pipeline");
          }
          setLoading(false);
        return resultData;
      })
      .catch((err) => {
        throw err;
      });
  }
  useEffect(() => {
   
    getSites()
  }, [canManage]);

  if (loading) {
    return null;
  }

  
  return (
    <Layout>
      <Protect permission="org:demo:all">
        <Overview />
      </Protect>
      <Protect permission="org:media:all">
        <OverviewPage />
      </Protect>
    </Layout>
  );
}
