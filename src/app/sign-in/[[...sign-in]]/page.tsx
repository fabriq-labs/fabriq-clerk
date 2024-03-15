import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="signin-container">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
