import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const traceExporter = new OTLPTraceExporter();
const spanProcessor = new BatchSpanProcessor(traceExporter);
const metricExporter = new OTLPMetricExporter();

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME,
  traceExporter: traceExporter,
  spanProcessor: spanProcessor,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
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
    }),
  ],
  autoDetectResources: true,
});

sdk.start();

export const shutdown = async () => {
  await sdk.shutdown();
};
