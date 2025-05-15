FROM grafana/otel-lgtm:latest 

COPY ./otel-collector-config.yaml /etc/otelcol/config.yaml

CMD [ "/otel-lgtm/run-all.sh", "--config=/etc/otelcol/config.yaml" ]
