const DEFAULT_GUIDORA_SDK_CDN_URL =
  "https://cdn.jsdelivr.net/npm/@guidora/sdk@0.1.0/dist/index.global.js";
const DEFAULT_GUIDORA_API_BASE_URL = "http://127.0.0.1:8000/api/guide";
const DEFAULT_GUIDORA_PROXY_PREFIX = "/__guidora";
const GUIDORA_LOCAL_SDK_ENTRY =
  typeof __GUIDORA_LOCAL_SDK_ENTRY__ === "string"
    ? __GUIDORA_LOCAL_SDK_ENTRY__
    : "";
const GUIDORA_PROXY_PREFIX =
  typeof __GUIDORA_DEV_PROXY_PREFIX__ === "string"
    ? __GUIDORA_DEV_PROXY_PREFIX__
    : DEFAULT_GUIDORA_PROXY_PREFIX;

let guidoraClientPromise = null;
let guidoraScriptPromise = null;

function readEnv(name, fallback = "") {
  const value = import.meta.env[name];
  if (typeof value === "string") {
    return value.trim();
  }
  return fallback;
}

function isGuidoraEnabled() {
  return readEnv("VITE_GUIDORA_ENABLED", "true") !== "false";
}

function getGuidoraApiBaseUrl() {
  return readEnv("VITE_GUIDORA_API_BASE_URL", DEFAULT_GUIDORA_API_BASE_URL);
}

function getGuidoraSdkCdnUrl() {
  return readEnv("VITE_GUIDORA_SDK_CDN_URL", DEFAULT_GUIDORA_SDK_CDN_URL);
}

function buildLocalKeyUrl() {
  const url = new URL(
    `${GUIDORA_PROXY_PREFIX}/api/demo-sdk-config`,
    window.location.origin,
  );
  url.searchParams.set("host", window.location.host);
  url.searchParams.set("path", window.location.pathname);
  return url.toString();
}

function loadGuidoraScript(src) {
  if (window.GuidoraSDK?.initGuidora) {
    return Promise.resolve(window.GuidoraSDK);
  }

  if (!guidoraScriptPromise) {
    guidoraScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[data-guidora-sdk="${src}"]`,
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window.GuidoraSDK?.initGuidora) {
            resolve(window.GuidoraSDK);
            return;
          }
          reject(new Error("Guidora SDK script loaded without a global API."));
        });
        existingScript.addEventListener("error", () => {
          reject(new Error("Guidora SDK script could not be loaded."));
        });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.guidoraSdk = src;
      script.onload = () => {
        if (window.GuidoraSDK?.initGuidora) {
          resolve(window.GuidoraSDK);
          return;
        }
        reject(new Error("Guidora SDK script loaded without a global API."));
      };
      script.onerror = () => {
        reject(new Error("Guidora SDK script could not be loaded."));
      };
      document.head.append(script);
    }).catch((error) => {
      guidoraScriptPromise = null;
      throw error;
    });
  }

  return guidoraScriptPromise;
}

async function loadGuidoraSdk() {
  if (import.meta.env.DEV && GUIDORA_LOCAL_SDK_ENTRY) {
    return import(/* @vite-ignore */ GUIDORA_LOCAL_SDK_ENTRY);
  }

  return loadGuidoraScript(getGuidoraSdkCdnUrl());
}

function resolveInitGuidora(moduleValue) {
  if (typeof moduleValue?.initGuidora === "function") {
    return moduleValue.initGuidora;
  }
  if (typeof window.GuidoraSDK?.initGuidora === "function") {
    return window.GuidoraSDK.initGuidora.bind(window.GuidoraSDK);
  }

  throw new Error("Guidora SDK initGuidora export is unavailable.");
}

async function resolveGuidoraApiKey() {
  const explicitApiKey = readEnv("VITE_GUIDORA_API_KEY");
  if (explicitApiKey) {
    return explicitApiKey;
  }

  if (!import.meta.env.DEV) {
    return "";
  }

  const response = await fetch(buildLocalKeyUrl(), {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.public_key) {
    throw new Error(
      String(payload?.error || "").trim() ||
        "Guidora public key could not be resolved for the local playground.",
    );
  }

  return String(payload.public_key).trim();
}

export async function initGuidoraPlayground() {
  if (!isGuidoraEnabled()) {
    return null;
  }

  if (!guidoraClientPromise) {
    guidoraClientPromise = (async () => {
      const apiKey = await resolveGuidoraApiKey();
      if (!apiKey) {
        console.warn(
          "[Guidora playground] VITE_GUIDORA_API_KEY is missing, so SDK bootstrap was skipped.",
        );
        return null;
      }

      const sdkModule = await loadGuidoraSdk();
      const initGuidora = resolveInitGuidora(sdkModule);
      const client = initGuidora({
        apiKey,
        apiBaseUrl: getGuidoraApiBaseUrl(),
        onError: (error) => {
          console.error("[Guidora playground]", error);
        },
      });

      await client.bootstrap({
        domain: window.location.host,
        path: window.location.pathname,
        traits: {
          surface: "e-commerce-panel",
          environment: import.meta.env.DEV ? "local" : "live",
        },
      });

      return client;
    })().catch((error) => {
      guidoraClientPromise = null;
      console.error("[Guidora playground]", error);
      return null;
    });
  }

  return guidoraClientPromise;
}