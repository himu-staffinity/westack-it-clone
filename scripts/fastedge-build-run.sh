#!/bin/bash

for file in auth callback request-demo test-edge; do
  npx fastedge-build --input "edge/${file}.js" --output "edge/${file}.wasm"
done

PORT=8080
echo "Starting FastEdge server at localhost:${PORT}"
fastedge-run http -w ./edge/test-edge.wasm --port "${PORT}"
