import * as React from 'react'
import ReactDOM from 'react-dom'
// import * as Sentry from "@sentry/react";
// import { Integrations } from '@sentry/tracing'
import App from './App'

// Sentry.init({
//   dsn: "https://46673849786b4a2a9b499645710b831e@o957016.ingest.sentry.io/5906327",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
//   release: 'v1.1.6',
// });

ReactDOM.render(<App />, document.getElementById('root'))
