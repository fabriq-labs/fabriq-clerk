// middleware
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { authorize } from "./helper";

export default authMiddleware({
  publicRoutes: ["/sign-in"],
  afterAuth(auth, req) {
    const { pathname } = req.nextUrl;

    const method = req.method;
    const role: any = auth?.orgRole;
    // if (auth.userId || auth.isPublicRoute) {
    //   return NextResponse.next();
    // }

    if (auth.userId || auth.isPublicRoute) {
      if (authorize(role, pathname, method)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(
          new URL("/api/auth/unauthorized", req.url)
        );
      }
    } else {
      return redirectToSignIn({
        returnBackUrl:
          process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL != "/"
            ? process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
            : req.url,
      });
    }
    // return redirectToSignIn({
    //   returnBackUrl:
    //     process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL != "/"
    //       ? process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
    //       : req.url,
    // });
  }
});

export const config = {
  matcher: ["/api/contact/:path*", "/api/company/:path*"],
};
