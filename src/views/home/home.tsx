// Result
import React from "react";
import { Protect } from "@clerk/nextjs";

import { Overview } from "@views/overview/overview";
import OverviewPage from "@views/overview/overview_main";
import Layout from "@components/layout";

export default function HomePage() {
  return (
    <Layout>
      <Protect permission="org:feature:protected">
        <Overview />
      </Protect>
      <Protect permission="org:demo:all">
        <Overview />
      </Protect>
      <Protect permission="org:media:all">
        <OverviewPage />
      </Protect>
    </Layout>
  );
}
