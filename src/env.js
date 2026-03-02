// src/env.js
export function getEnvVar(key, fallback) {
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return fallback;
}
