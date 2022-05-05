import router from '@/router';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
export default {
  install(app) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        app,
        dsn: process.env.VUE_APP_SENTRY_DSN,
        integrations: [
          new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
        ],
        tracesSampleRate: 0,
        tracingOptions: {
          trackComponents: true,
        },
        logErrors: true,
        attachProps: true,
        attachStacktrace: true,
        ignoreErrors: [
          'Avoided redundant navigation to current location',
          /Loading chunk .* failed/,
          /Navigation cancelled from .* to .* with a new navigation/,
          'Navigation cancelled from',
        ],
        release: process.env.VUE_APP_COMMIT_HASH,
      });
    }
  },
};
