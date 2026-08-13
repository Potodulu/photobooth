import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/try",
        destination: "/online",
        permanent: true,
      },
      {
        source: "/try/:path*",
        destination: "/online/:path*",
        permanent: true,
      },
      {
        source: "/en/try",
        destination: "/en/online",
        permanent: true,
      },
      {
        source: "/en/try/:path*",
        destination: "/en/online/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
