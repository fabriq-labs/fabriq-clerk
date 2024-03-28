"use client";

import React, { useEffect, useState } from "react";
import { Protect, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Overview } from "@views/overview/overview";
import OverviewPage from "@views/overview/overview_main";
import Layout from "@components/layout";
import ErrorResult from "@/components/error_result";

const HomePage = () => {
  const { has } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const canManage = has && has({ permission: "org:data:all" });
  const mediaOrg = has && has({ permission: "org:media:all" });
  const userOrg = has && has({ permission: "org:users:all" });

  useEffect(() => {
    const getSites = async () => {
      try {
        const sites = localStorage.getItem("sites");
        const siteDetails = localStorage.getItem("site_details");
        const orgSettings = localStorage.getItem("org_settings");
        if (mediaOrg && !sites && !siteDetails && !orgSettings) {
          setLoading(true);
          const sitesResult = await axios.get("/api/sites");
          const orgSettingsResult = await axios.post("/api/organization", {
            operation: "getOrgSettings",
          });

          const sitesData = sitesResult.data;
          const orgSettingsData = orgSettingsResult.data;

          await localStorage.setItem("sites", JSON.stringify(sitesData));
          await localStorage.setItem(
            "site_details",
            JSON.stringify(sitesData[0])
          );

          await localStorage.setItem(
            "org_settings",
            orgSettingsData?.data?.organizations[0]?.settings
          );

          setLoading(false);
        } else {
          if (canManage) {
            router.push("/pipeline");
          }

          if(userOrg) {
            router.push("/user-profile");
          }

          setLoading(false);
        }

        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    getSites();
  }, [canManage, mediaOrg, router]);

  if (loading) {
    return null;
  }

  if (error) {
    return <ErrorResult />;
  }

  return (
    <Layout>
      {error ? (
        <ErrorResult />
      ) : (
        !loading && (
          <>
            <Protect permission="org:demo:all">
              <Overview />
            </Protect>
            <Protect permission="org:media:all">
              <OverviewPage />
            </Protect>
          </>
        )
      )}
    </Layout>
  );
};

export default HomePage;
