import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login'
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt'},
  secret: process.env.AUTH_SECRET,
  ...authConfig
});