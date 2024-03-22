"use client";

import React, { useEffect, useState } from "react";
import { Protect, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Overview } from "@views/overview/overview";
import OverviewPage from "@views/overview/overview_main";
import Layout from "@components/layout";

export default function HomePage() {
  const { has } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const canManage = has && has({ permission: "org:feature:protected" });

  useEffect(() => {
    if (canManage) {
      router.push("/pipeline");
    }
    setLoading(false);
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
