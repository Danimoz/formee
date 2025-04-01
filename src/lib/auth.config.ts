import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user) return null;
          const isValidPassword = await bcrypt.compare(credentials.password as string, user.password as string);
          return isValidPassword ? user : null;
        } catch (error) {
          return null;
        }
      },
    })
  ],
} satisfies NextAuthConfig