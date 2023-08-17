FROM --platform=linux/amd64 ghcr.io/openfaas/of-watchdog:0.9.11 as watchdog
FROM --platform=linux/amd64 golang:1.20-bullseye as build

USER root

ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

RUN if test -n "${ADDITIONAL_PACKAGE}"; then apt-get update \
    && apt-get install -y curl gnupg git \
    && curl -sLSf https://dl-ssl.google.com/linux/linux_signing_key.pub -o - | apt-key add - \
    && apt-get update ;fi

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog


RUN mkdir -p /go/src/handler
WORKDIR /go/src/handler
COPY . .

ARG GO111MODULE="on"
ARG GOPROXY=""
ARG GOFLAGS=""
ARG CGO_ENABLED=0
ENV CGO_ENABLED=${CGO_ENABLED}

# Run a gofmt and exclude all vendored code.
RUN test -z "$(gofmt -l $(find . -type f -name '*.go' -not -path "./vendor/*" -not -path "./function/vendor/*"))" || { echo "Run \"gofmt -s -w\" on your Golang code"; exit 1; }

WORKDIR /go/src/handler/function
RUN mkdir -p /go/src/handler/function/static

RUN GOOS=linux GOARCH=amd64 go test ./... -cover

WORKDIR /go/src/handler
RUN GOOS=linux GOARCH=amd64 \
    go build --ldflags "-s -w" -o handler .

RUN go install github.com/playwright-community/playwright-go/cmd/playwright@latest

FROM --platform=linux/amd64 mcr.microsoft.com/playwright:v1.35.1-jammy

USER root

RUN mkdir -p /home/app

WORKDIR /home/app

COPY --from=build /go/src/handler/handler           .
COPY --from=build /usr/bin/fwatchdog                .
COPY --from=build /go/src/handler/function/static   static
COPY --from=build /go/bin/playwright                .

RUN ./playwright install --with-deps

ENV fprocess="./handler"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:8082"
ENV prefix_logs="false"

CMD ["./fwatchdog"]
