// src/env.js
export function getEnvVar(key, fallback) {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  // Only try to access import.meta.env in environments that support it
  try {
    // eslint-disable-next-line no-eval
    const viteEnv = eval('import.meta.env');
    if (viteEnv && viteEnv[key]) {
      return viteEnv[key];
    }
  } catch (e) {
    // Ignore if not available
  }
  return fallback;
}
