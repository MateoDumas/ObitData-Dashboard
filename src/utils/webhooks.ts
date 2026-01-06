export interface WebhookConfig {
  id: string;
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  enabled: boolean;
  events: string[];
  secret?: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: number;
  data: any;
}

/**
 * Send webhook notification
 */
export async function sendWebhook(
  config: WebhookConfig,
  payload: WebhookPayload
): Promise<boolean> {
  if (!config.enabled) return false;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (config.secret) {
      headers['X-Webhook-Secret'] = config.secret;
    }

    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('Webhook error:', error);
    return false;
  }
}

/**
 * Create webhook payload for alert
 */
export function createAlertWebhookPayload(alert: any): WebhookPayload {
  return {
    event: 'alert.triggered',
    timestamp: Date.now(),
    data: {
      id: alert.id,
      metricId: alert.metricId,
      metricName: alert.metricName,
      value: alert.value,
      threshold: alert.threshold,
      severity: alert.severity,
      message: alert.message,
    },
  };
}

/**
 * Create webhook payload for metric update
 */
export function createMetricWebhookPayload(metric: any): WebhookPayload {
  return {
    event: 'metric.updated',
    timestamp: Date.now(),
    data: {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
      category: metric.category,
      timestamp: metric.timestamp,
    },
  };
}
