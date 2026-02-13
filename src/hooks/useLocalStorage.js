import { useState, useEffect } from "react";

/**
 * useLocalStorage
 *
 * Syncs a value with localStorage. Returns [value, setValue].
 *
 * @param {string} key - The key in localStorage
 * @param {any} initialValue - The initial value to use if not in localStorage
 */
function useLocalStorage(key, initialValue = null) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
