import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is signed in and the current path is / redirect the user to /profile
  if (user && req.nextUrl.pathname === "/signin") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // if user is not signed in and the current path is not /signin redirect the user to /signin
  if (!user && req.nextUrl.pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/account"],
};
