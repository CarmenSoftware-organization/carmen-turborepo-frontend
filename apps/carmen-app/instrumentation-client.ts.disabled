// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryDsn } from "./lib/backend-api";


Sentry.init({
  dsn: sentryDsn || "http://0fc6ab901b20d778eefd550dfbe077b4@dev.blueledgers.com:3997/3",

  // Use tunnel route to avoid CORS issues
  tunnel: "/monitoring",

  // Add optional integrations for additional features
  integrations: [
    // Replay integration is not available in @sentry/nextjs
    // Use @sentry/replay if you need replay functionality
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Replay functionality removed - not available in @sentry/nextjs
  // To use replay, install @sentry/replay package separately

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true, // Enable debug mode to see more details

  // Add environment and release info
  environment: process.env.NODE_ENV || 'development',
  release: process.env.npm_package_version || '1.0.0',

  // Add beforeSend to handle errors
  beforeSend(event) {
    console.log('📤 Sending event to Sentry via tunnel:', event);
    return event;
  },

  // Add beforeSendTransaction to handle transactions
  beforeSendTransaction(event) {
    console.log('📤 Sending transaction to Sentry via tunnel:', event);
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;