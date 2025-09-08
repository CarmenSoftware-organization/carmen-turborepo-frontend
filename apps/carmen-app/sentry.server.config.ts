// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryDsn } from "./lib/backend-api";

console.log('🔧 Initializing Sentry Server...');
console.log('📡 Sentry DSN:', sentryDsn || "http://0fc6ab901b20d778eefd550dfbe077b4@dev.blueledgers.com:3997/3");

Sentry.init({
  dsn: sentryDsn || "http://0fc6ab901b20d778eefd550dfbe077b4@dev.blueledgers.com:3997/3",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true, // Enable debug mode to see tunnel requests
});

console.log('✅ Sentry Server initialized successfully');

// Test server-side Sentry
setTimeout(() => {
  try {
    Sentry.captureMessage('Sentry Server connectivity test', 'info');
    console.log('✅ Sentry Server test message sent successfully');
  } catch (error) {
    console.error('❌ Sentry Server test failed:', error);
  }
}, 1000);
