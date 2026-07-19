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
