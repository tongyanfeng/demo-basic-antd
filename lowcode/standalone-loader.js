"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/standalone-loader.ts
var standalone_loader_exports = {};
__export(standalone_loader_exports, {
  DEFAULT_TIMEOUT_IN_MS: () => DEFAULT_TIMEOUT_IN_MS,
  DEFAULT_WORKER_JS: () => DEFAULT_WORKER_JS,
  generateCode: () => generateCode,
  generateZip: () => generateZip,
  init: () => init
});
module.exports = __toCommonJS(standalone_loader_exports);
var import_node_fetch = __toESM(require("node-fetch"));
var DEFAULT_WORKER_JS = `http://localhost:5556/lowcode/standalone-worker.min.js`;
var DEFAULT_TIMEOUT_IN_MS = 60 * 1e3;
var workerJsCache = /* @__PURE__ */ new Map();
async function init({
  workerJsUrl = DEFAULT_WORKER_JS
} = {}) {
  await loadWorkerJs(workerJsUrl);
}
async function generateCode(options) {
  if (typeof self !== "object") {
    throw new Error("self is not defined");
  }
  if (typeof Worker !== "function") {
    throw new Error("Worker is not supported");
  }
  const workerJsUrl = options.workerJsUrl || DEFAULT_WORKER_JS;
  const workerJs = await loadWorkerJs(workerJsUrl);
  const worker = new Worker(workerJs.url, {
    type: "classic",
    credentials: "omit"
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("timeout"));
      worker.terminate();
    }, options.timeoutInMs || DEFAULT_TIMEOUT_IN_MS);
    worker.onmessage = (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "ready":
          print("worker is ready.");
          break;
        case "run:begin":
          print("worker is running...");
          break;
        case "run:end":
          print("worker is done.");
          resolve(msg.result);
          clearTimeout(timer);
          worker.terminate();
          break;
        case "run:error":
          printErr(`worker error: ${msg.errorMsg}`);
          clearTimeout(timer);
          reject(new Error(msg.errorMsg || "unknown error"));
          worker.terminate();
          break;
        default:
          print("got unknown msg: %o", msg);
          break;
      }
    };
    worker.onerror = (err) => {
      printErr("worker error: %o", err);
      clearTimeout(timer);
      reject(err);
      worker.terminate();
    };
    worker.postMessage({
      type: "run",
      solution: options.solution,
      schema: options.schema,
      flattenResult: options.flattenResult
    });
  });
}
async function loadWorkerJs(workerJsUrl) {
  const cached = workerJsCache.get(workerJsUrl);
  if (cached) {
    return cached;
  }
  const workerJsContent = await (0, import_node_fetch.default)(workerJsUrl).then((res) => res.text()).catch((err) => {
    throw new Error(`Failed to fetch worker js: ${err}`);
  });
  const workerJs = {
    content: workerJsContent,
    url: self.URL.createObjectURL(
      new self.Blob([workerJsContent], { type: "application/javascript" })
    )
  };
  workerJsCache.set(workerJsUrl, workerJs);
  return workerJs;
}
function print(msg, ...args) {
  console.debug(`[code-generator/loader]: ${msg}`, ...args);
}
function printErr(msg, ...args) {
  console.debug(`[code-generator/loader]: %c${msg}`, "color:red", ...args);
}
async function generateZip(options) {
  if (typeof self !== "object") {
    throw new Error("self is not defined");
  }
  if (typeof Worker !== "function") {
    throw new Error("Worker is not supported");
  }
  const workerJsUrl = options.workerJsUrl || DEFAULT_WORKER_JS;
  const workerJs = await loadWorkerJs(workerJsUrl);
  const worker = new Worker(workerJs.url, {
    type: "classic",
    credentials: "omit"
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("timeout"));
      worker.terminate();
    }, options.timeoutInMs || DEFAULT_TIMEOUT_IN_MS);
    worker.onmessage = (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "ready":
          print("worker is ready.");
          break;
        case "zip:begin":
          print("worker is running...");
          break;
        case "zip:end":
          print("worker is done.");
          console.log("zip done:", msg);
          resolve(msg.result);
          clearTimeout(timer);
          worker.terminate();
          break;
        case "zip:error":
          printErr(`worker error: ${msg.errorMsg}`);
          clearTimeout(timer);
          reject(new Error(msg.errorMsg || "unknown error"));
          worker.terminate();
          break;
        default:
          print("got unknown msg: %o", msg);
          break;
      }
    };
    worker.onerror = (err) => {
      printErr("worker error: %o", err);
      clearTimeout(timer);
      reject(err);
      worker.terminate();
    };
    worker.postMessage({
      type: "zip",
      outputPath: options.outputPath,
      project: options.project
    });
  });
}
//# sourceMappingURL=standalone-loader.js.map
