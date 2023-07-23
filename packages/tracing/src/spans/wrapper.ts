import {
  Attributes,
  Context,
  trace,
  context,
  Span,
  SpanStatusCode,
} from '@opentelemetry/api';
import { getActiveSpan as getActiveOtelSpan } from '@opentelemetry/api/build/src/trace/context-utils';
import { sanitizeAttributes } from '@opentelemetry/core';

const ip = require('ip');

export declare type ObservabilityFunction<
  Parameters extends Array<any> = Array<any>,
  Result = any,
> = (...params: Parameters) => Promise<Result>;

/**
 * @param spanName the name of the span, be sure to check
 * https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/
 * for common naming conventions
 * @param [attributes] map of attributes to attach to the span
 * @param [parentContext] the root parent context, this is usually
 * not needed unless you are build a new parent from another
 * @param run the function to be wrapped
 */
export type WithObservabilityOptions = {
  spanName: string;
  attributes?: Attributes;
  parentContext?: Context;
  run: ObservabilityFunction;
};

type WrappedSpanErrorOptions = {
  span: Span;
};

const handleWrappedSpanError = (options: WrappedSpanErrorOptions, err: any) => {
  const { span } = options;
  span.setStatus({ code: SpanStatusCode.ERROR });
  span.recordException(err);
};

/**
 * Creates a new promise that wraps the function
 * specified in `options.run` field in a span.start()
 * and spand.end(), allowing it to be traced.
 * @param options the options to pass to the span
 * @returns Promise<any>
 */
export const withObservabilityFunction = <
  Parameters extends Array<any> = Array<any>,
  Result = any,
>(
  options: WithObservabilityOptions,
): ObservabilityFunction<Parameters, Result> => {
  return async (...params) => {
    const { spanName, attributes, parentContext } = options;
    let ctx = parentContext;
    if (!ctx || !trace.getSpanContext(ctx)) {
      ctx = context.active();
    }

    return trace
      .getTracer(process.env.OTEL_SERVICE_NAME ?? 'unknown')
      .startActiveSpan(
        spanName,
        { attributes: processAttributes(attributes) },
        ctx,
        async (span) => {
          try {
            return options
              .run(...params)
              .catch((err) => {
                handleWrappedSpanError({ span }, err);
                return Promise.reject(err);
              })
              .finally(() => span.end());
          } catch (err) {
            handleWrappedSpanError({ span }, err);
            span.end();
            throw err;
          }
        },
      );
  };
};

const processAttributes = (
  attributes: Attributes | undefined,
): Attributes | undefined => {
  if (!attributes) {
    return undefined;
  }
  attributes['process_id'] = process.pid;
  attributes['contained_id'] = process.env.HOSTNAME;
  attributes['ip_address'] = ip.address();

  return sanitizeAttributes(attributes);
};

/**
 * Gets the span from the current context, if one exists.
 */
export const getActiveSpan = () => {
  return getActiveOtelSpan();
};
