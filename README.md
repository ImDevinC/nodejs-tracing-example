This project is simply serving as a POC of creating a simplified wrapper for using OpenTelemetry and allowing people to import it more easily.

The package is not currently published, but an example of both tracing and metrics usage can be seen in `packages/sample`

This project also contains a local opentelemtry collector with Jaeger and a Prometheus endpoint to be able to verify things are working properly. They can be started by running `docker-compose up` and then browsing to `localhost:8889/metrics` for viewing the metrics ingested and `localhost:16686` for viewing traces using Jaeger.