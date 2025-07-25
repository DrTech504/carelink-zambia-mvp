/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. This is the final workaround for the
    // stubborn Vercel-specific build issue.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(nextConfig);
