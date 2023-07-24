import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { diag } from '@opentelemetry/api';

const traceExporter = new OTLPTraceExporter();
const spanProcessor = new BatchSpanProcessor(traceExporter);
const metricExporter = new OTLPMetricExporter();

const rawMetricsTimeout =
  process.env.OTEL_EXPORTER_OTLP_METRICS_TIMEOUT ?? '1000';
const metricsTimeout = parseInt(rawMetricsTimeout) || 1000;

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME,
  traceExporter: traceExporter,
  spanProcessor: spanProcessor,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportTimeoutMillis: metricsTimeout,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
      '@opentelemetry/instrumentation-aws-sdk': {
        enabled: true,
        suppressInternalInstrumentation: true,
      },
      '@opentelemetry/instrumentation-dns': {
        enabled: false,
      },
    }),
  ],
  autoDetectResources: true,
});

sdk.start();

/**
 * stops the active SDK, including tracing and
 * metrics. Depending on items in the queue, this could
 * take extended time.
 * This function should not throw an error but rather
 * catches the error and prints it to the console.
 */
export const shutdown = async () => {
  await sdk.shutdown().catch((err) =>
    diag.error(
      JSON.stringify({
        message: 'failed to shutdown tracing SDK',
        error: err,
      }),
    ),
  );
};
