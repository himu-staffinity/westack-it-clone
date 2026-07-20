#!/bin/bash

# build the wasm files
for file in github request-demo test-edge; do
  npx fastedge-build --input "edge/${file}.js" --output "edge/${file}.wasm"
done

# run a test wasm file server
PORT=8080
echo "Starting FastEdge server at localhost:${PORT}"

fastedge-run http -w ./edge/github.wasm --port "${PORT}" --wasi-http true
