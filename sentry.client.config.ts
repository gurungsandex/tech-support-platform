import * as Sentry from '@sentry/nextjs'

// Sentry no-ops if dsn is undefined, so this is safe to ship even before
// NEXT_PUBLIC_SENTRY_DSN is set.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
})
