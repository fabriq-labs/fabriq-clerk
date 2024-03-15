// middleware
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/api/user_create(.*)"],
  afterAuth(auth, req) {
    if (auth.userId || auth.isPublicRoute) {
      return NextResponse.next();
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl:
          process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL != "/"
            ? process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
            : req.url,
      });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
