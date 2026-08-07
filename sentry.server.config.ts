// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5a77373b2083b950a1af3f19bbd0474a@o4509901041500160.ingest.us.sentry.io/4511855227502592",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Deshabilitado explícitamente: los server actions de este sistema
  // manejan PII real de producción (login, datos de familia, cédulas —
  // ver advertencia en CLAUDE.md sobre IpsumDatabase.sql). Sentry no debe
  // recibir el cuerpo de esos requests ni datos de usuario/IP.
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});
