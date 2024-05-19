import * as Sentry from "@sentry/node";

export class Logger {
  static log(error: unknown) {
    Sentry.captureException(error, {});
  }
}
