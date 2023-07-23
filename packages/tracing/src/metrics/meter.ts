import { metrics } from '@opentelemetry/api';

/**
 * Returns a meter from the global meter provider using the OTEL_SERVICE_NAME
 */
const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME ?? 'unknown');

export { meter };
