/**
 * Configuração principal do Auth.js (next-auth v5).
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const providers = [
  ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : []),
  ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
    ? [
        GitHub({
          clientId: env.AUTH_GITHUB_ID,
          clientSecret: env.AUTH_GITHUB_SECRET,
        }),
      ]
    : []),
  Resend({
    apiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM,
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.emailVerified = user.emailVerified ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
});
