import { useEffect, useState, useCallback } from "react";

export interface SavedRec {
  id: string;
  savedAt: string;
  cropId: string;
  cropName: string;
  demoScore: number;
  location: string;
  season: string;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
    const onSync = (e: Event) => {
      if ((e as CustomEvent).detail === key) {
        const raw = localStorage.getItem(key);
        if (raw) setValue(JSON.parse(raw));
      }
    };
    window.addEventListener("ls-sync", onSync);
    return () => window.removeEventListener("ls-sync", onSync);
  }, [key]);
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      queueMicrotask(() => window.dispatchEvent(new CustomEvent("ls-sync", { detail: key })));
      return next;
    });
  }, [key]);
  return [value, set, ready] as const;
}

export const useSaved = () => useLocalStorage<SavedRec[]>("km-saved", []);
export const useCompare = () => useLocalStorage<string[]>("km-compare", []);
