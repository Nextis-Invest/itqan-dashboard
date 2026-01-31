import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        magicLinkVerified: { label: "Magic Link Verified", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const magicLinkVerified = credentials?.magicLinkVerified;

        if (typeof email !== "string") {
          return null;
        }

        if (magicLinkVerified !== "true") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
          }
        });

        if (!user || !user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // For OAuth providers, the role might not be set yet — load from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id || (token.sub as string) },
          select: { role: true },
        });
        token.role = dbUser?.role || (user as any).role || "CLIENT";
      }
      // Store the LinkedIn access token for profile import
      if (account?.provider === "linkedin" && account.access_token) {
        token.linkedinAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role as string;
        (session.user as any).linkedinAccessToken = token.linkedinAccessToken as string | undefined;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth sign-ins, ensure emailVerified is set
      if (account?.provider === "google" || account?.provider === "linkedin") {
        if (user.id) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          }).catch(() => {
            // User might not exist yet (first sign-in), adapter handles creation
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
