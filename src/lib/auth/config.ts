import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"

// Use parent domain for cookies in production to enable SSO across subdomains
const isProduction = process.env.NODE_ENV === "production"
const cookieDomain = isProduction ? ".itqan.ma" : undefined

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: cookieDomain,
      },
    },
    callbackUrl: {
      name: isProduction ? "__Secure-authjs.callback-url" : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        domain: cookieDomain,
      },
    },
    csrfToken: {
      name: isProduction ? "__Host-authjs.csrf-token" : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        // csrfToken cannot have domain set (browser security)
      },
    },
  },
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
    async jwt({ token, user, account, trigger }) {
      if (user) {
        // For OAuth providers, the role might not be set yet — load from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id || (token.sub as string) },
          select: { role: true, emailVerified: true },
        });
        token.role = dbUser?.role || (user as any).role || "CLIENT";
        token.emailVerified = dbUser?.emailVerified;
      }
      // Refresh emailVerified on update trigger
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { emailVerified: true },
        });
        token.emailVerified = dbUser?.emailVerified;
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
        (session.user as any).emailVerified = token.emailVerified as Date | null | undefined;
        (session.user as any).linkedinAccessToken = token.linkedinAccessToken as string | undefined;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth sign-ins, handle account linking and emailVerified
      if (account?.provider === "google" || account?.provider === "linkedin") {
        const email = user.email || profile?.email;
        
        if (email) {
          // Check if user exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this OAuth account is already linked
            const linkedAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId
            );

            if (!linkedAccount) {
              // Link the OAuth account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }

            // Ensure emailVerified is set
            if (!existingUser.emailVerified) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { emailVerified: new Date() },
              });
            }

            // Update user object for JWT callback
            user.id = existingUser.id;
          }
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
