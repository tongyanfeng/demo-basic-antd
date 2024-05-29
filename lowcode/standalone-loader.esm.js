// src/standalone-loader.ts
import fetch from "node-fetch";
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
  const workerJsContent = await fetch(workerJsUrl).then((res) => res.text()).catch((err) => {
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
export {
  DEFAULT_TIMEOUT_IN_MS,
  DEFAULT_WORKER_JS,
  generateCode,
  generateZip,
  init
};
//# sourceMappingURL=standalone-loader.esm.js.map
