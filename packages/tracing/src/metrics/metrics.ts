import { MetricOptions } from '@opentelemetry/api';
import { meter } from './meter';

/**
 * Creates a new `Counter` metric. Generally, this kind of metric when the
 * value is a quantity, the sum is of primary interest, and the event count
 * and value distribution are not of primary interest.
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createCounter = (name: string, options?: MetricOptions) => {
  return meter.createCounter(name, options);
};

/**
 * Creates and returns a new `Histogram`.
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createHistogram = (name: string, options?: MetricOptions) => {
  return meter.createHistogram(name, options);
};

/**
 * Creates a new `ObservableCounter` metric.
 *
 * The callback SHOULD be safe to be invoked concurrently.
 *
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createObservableCounter = (
  name: string,
  options?: MetricOptions,
) => {
  return meter.createObservableCounter(name, options);
};

/**
 * Creates a new `ObservableGauge` metric.
 *
 * The callback SHOULD be safe to be invoked concurrently.
 *
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createObservableGauge = (
  name: string,
  options?: MetricOptions,
) => {
  return meter.createObservableGauge(name, options);
};

/**
 * Creates a new `ObservableUpDownCounter` metric.
 *
 * The callback SHOULD be safe to be invoked concurrently.
 *
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createObservableUpDownCounter = (
  name: string,
  options?: MetricOptions,
) => {
  return meter.createObservableUpDownCounter(name, options);
};

/**
 * Creates a new `UpDownCounter` metric. UpDownCounter is a synchronous
 * instrument and very similar to Counter except that Add(increment)
 * supports negative increments. It is generally useful for capturing changes
 * in an amount of resources used, or any quantity that rises and falls
 * during a request.
 * Example uses for UpDownCounter:
 * <ol>
 *   <li> count the number of active requests. </li>
 *   <li> count memory in use by instrumenting new and delete. </li>
 *   <li> count queue size by instrumenting enqueue and dequeue. </li>
 *   <li> count semaphore up and down operations. </li>
 * </ol>
 *
 * @param name the name of the metric.
 * @param [options] the metric options.
 */
export const createUpDownCounter = (name: string, options?: MetricOptions) => {
  return meter.createUpDownCounter(name, options);
};
