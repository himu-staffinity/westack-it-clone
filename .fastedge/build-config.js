const config = {
  "type": "static",
  "entryPoint": ".fastedge/server.js",
  "ignoreDotFiles": true,
  "ignoreDirs": [
    "./node_modules"
  ],
  "ignoreWellKnown": false,
  "tsConfigPath": "./tsconfig.json",
  "wasmOutput": ".fastedge/fastedge.wasm",
  "publicDir": "./dist"
};

const serverConfig = {
  "type": "static",
  "extendedCache": [],
  "publicDirPrefix": "",
  "compression": [],
  "notFoundPage": "/404.html",
  "autoExt": [],
  "autoIndex": [
    "index.html",
    "index.htm"
  ],
  "spaEntrypoint": null
};

export { config, serverConfig };
