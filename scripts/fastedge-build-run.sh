#!/bin/bash

# build the combined wasm file
npx fastedge-build --config .fastedge/build-config.js

# run the combined wasm file
PORT=8080
echo "Starting FastEdge server at localhost:${PORT}"

fastedge-run http -w .fastedge/fastedge.wasm --port "${PORT}" --wasi-http true
