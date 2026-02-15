import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/:locale/register",
        destination: "/:locale/login",
        permanent: true,
      },
      {
        source: "/freelancers",
        destination: "/freelances",
        permanent: true,
      },
      {
        source: "/:locale/freelancers",
        destination: "/:locale/freelances",
        permanent: true,
      },
      // Gigs supprimés → dashboard
      {
        source: "/gigs",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/:locale/gigs",
        destination: "/:locale/dashboard",
        permanent: true,
      },
      {
        source: "/gigs/new",
        destination: "/missions/new",
        permanent: true,
      },
      {
        source: "/:locale/gigs/new",
        destination: "/:locale/missions/new",
        permanent: true,
      },
      {
        source: "/gigs/:id",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/:locale/gigs/:id",
        destination: "/:locale/dashboard",
        permanent: true,
      },
      {
        source: "/gigs/:id/edit",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/:locale/gigs/:id/edit",
        destination: "/:locale/dashboard",
        permanent: true,
      },
      // Old marketplace routes
      {
        source: "/marketplace",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:locale/marketplace",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/marketplace/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:locale/marketplace/:path*",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
