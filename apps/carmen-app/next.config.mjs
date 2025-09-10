// import { withSentryConfig } from '@sentry/nextjs'; // DISABLED
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyjson.com',
        pathname: '/recipes/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/recipe-images/**',
        search: '',
      },
    ],
  },
  reactStrictMode: false,
};

// SENTRY DISABLED - Export without Sentry wrapper
export default withNextIntl(nextConfig);

// ORIGINAL SENTRY CONFIG (DISABLED):
// export default withSentryConfig(withNextIntl(nextConfig), {
//   org: "sentry",
//   project: "3",
//   sentryUrl: "http://dev.blueledgers.com:3997/",
//   silent: !process.env.CI,
//   widenClientFileUpload: true,
//   tunnelRoute: "/monitoring",
//   disableLogger: true,
//   automaticVercelMonitors: true,
// });