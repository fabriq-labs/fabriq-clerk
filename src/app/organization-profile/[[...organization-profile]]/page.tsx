import { OrganizationProfile } from "@clerk/nextjs";

import Layout from "@/components/layout";

export default function OrganizationProfilePage() {
  return (
    <Layout>
      <div className="profile-page">
        <OrganizationProfile />
      </div>
    </Layout>
  );
}
