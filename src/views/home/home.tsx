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

  const getSites = async () => {
    try {
      const sitesResult = await axios.post("/api/sites", {});
      const orgSettingsResult = await axios.post("/api/organization", {
        operation: "getOrgSettings",
      });
  
      const sitesData = sitesResult.data;
      const orgSettingsData = orgSettingsResult.data;
  
      localStorage.setItem("sites", JSON.stringify(sitesData));
      localStorage.setItem("site_details", JSON.stringify(sitesData[0]));
  
      localStorage.setItem(
        "org_settings",
        orgSettingsData?.data?.organizations[0]?.settings
      );
  
      if (canManage) {
        router.push("/pipeline");
      }
      
      setLoading(false);
  
      return sitesData;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    getSites();
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
