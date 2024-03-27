"use client";

import React, { useEffect, useState } from "react";
import { Protect, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Overview } from "@views/overview/overview";
import OverviewPage from "@views/overview/overview_main";
import Layout from "@components/layout";
import ErrorResult from "@/components/error_result";

export default function HomePage() {
  const { has } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [siteDetails, setSiteDetails] = useState(null);
  const [organization, setOrganization] = useState(null);
  const canManage = has && has({ permission: "org:feature:protected" });
  const mediaOrg = has && has({ permission: "org:media:all" });

  const getSites = async () => {
    try {
      if (mediaOrg) {
        const sitesResult = await axios.get("/api/sites");
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

        setSiteDetails(sitesData?.[0]);
        setOrganization(
          JSON.parse(orgSettingsData?.data?.organizations[0]?.settings)
        );

        if (canManage) {
          router.push("/pipeline");
        }

        setLoading(false);
        return sitesData;
      } else {
        if (canManage) {
          router.push("/pipeline");
        }

        setLoading(false);
      }

      setError(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    getSites();
  }, [canManage]);

  if (loading) {
    return null;
  }

  if (error) {
    return <ErrorResult />;
  }

  return (
    <Layout>
      <Protect permission="org:demo:all">
        <Overview />
      </Protect>
      <Protect permission="org:media:all">
        <OverviewPage siteDetails={siteDetails} organization={organization}/>
      </Protect>
    </Layout>
  );
}
