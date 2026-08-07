// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5a77373b2083b950a1af3f19bbd0474a@o4509901041500160.ingest.us.sentry.io/4511855227502592",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Ver sentry.server.config.ts: mismo motivo (PII real de producción).
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});
