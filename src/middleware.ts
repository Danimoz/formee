import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/", "/login", "/signup"]

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const session = await auth()
  const isPublicRoute = publicRoutes.includes(path);
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}