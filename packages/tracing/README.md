# Tracing Library
This library acts as a very simple wrapper around both OpenTelemtry Metrics and OpenTelemetry Tracing. It is designed to be simple to use, but expose areas where users who are familiar with the settings can adjust them.

## Getting started
1. After importing the project to your library, you should make to sure to pass `NODE_OPTIONS='--require ../tracing/dist/src/setup.js'`. The setup file will start the SDK using default provider options. Some options are configurable using the [OpenTelemetry environment variables](https://opentelemetry.io/docs/concepts/sdk-configuration/general-sdk-configuration/).
1. Before your application exits, make sure to call and `await shutdown()` as this gives the exporters time to finish their processing.
2. For any function you wish to instrument, wrap it in a `withObservabilityFunction()` wrapper as shown in the example below.
3. Use the `create<Metric>` types exported from `metrics/` to create and publish metrics of different types.

## Examples
```typescript
// Original
const mainWork = async () => {
  logger.info('doing stuff');
    for (let i = 0; i < 3; i += 1) {
      doWork(i);
    }
    await listBuckets();
    try {
      await expectBrokeBucket();
    } catch (err) {
      logger.error(err);
    }
    logger.info('done doing stuff');
}

// Wrapped
const mainWork = withObservabilityFunction({
  spanName: 'main',
  run: async () => {
    logger.info('doing stuff');
    for (let i = 0; i < 3; i += 1) {
      doWork(i);
    }
    await listBuckets();
    try {
      await expectBrokeBucket();
    } catch (err) {
      logger.error(err);
    }

    logger.info('done doing stuff');
  },
});
```

```typescript
function increaseCounter() {
  const counter = createCounter('counter', {
      description: 'Example counter',
    });
    for (let i = 0; i < 3; i += 1) {
      counter.add(i)
    }
}

```