import { UserProfile } from "@clerk/nextjs";

import Layout from "@/components/layout";

export default function UserProfilePage() {
  return (
    <Layout>
      <div className="profile-page">
        <UserProfile />
      </div>
    </Layout>
  );
}
