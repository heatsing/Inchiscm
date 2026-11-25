type AnalyticsParameter = string | number | boolean;

export function trackAnalyticsEvent(
  event: string,
  parameters: Record<string, AnalyticsParameter> = {},
) {
  const win = window as typeof window & {
    dataLayer?: Record<string, unknown>[];
  };
  win.dataLayer?.push({ event, ...parameters });
}

export function trackGa4Event(event: string, parameters: Record<string, AnalyticsParameter> = {}) {
  const win = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (command: "event", name: string, parameters: Record<string, AnalyticsParameter>) => void;
  };
  const send: NonNullable<typeof win.gtag> = win.gtag ?? function () {
    // Match the Arguments object queued by the gtag loader.
    // eslint-disable-next-line prefer-rest-params
    (win.dataLayer ??= []).push(arguments);
  };
  send("event", event, parameters);
}
