import { useEffect, useState, useCallback } from "react";

export interface SavedRecommendation {
  id: string;
  savedAt: string;
  cropId: string;
  cropName: string;
  cropKannada: string;
  matchScore: number;
  matchLevel: "High" | "Moderate" | "Low";
  location: string;
  season: string;
}

export interface FarmerProfile {
  name: string;
  mobile: string;
  preferredLang: "kn" | "en";
  taluk: string;
  village: string;
  farmArea: string;
  soilType: string;
  waterSource: string;
  isLoggedIn: boolean;
  registeredAt?: string;
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
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch { /* ignore */ }
      queueMicrotask(() => window.dispatchEvent(new CustomEvent("ls-sync", { detail: key })));
      return next;
    });
  }, [key]);

  return [value, set, ready] as const;
}

export const useSaved = () => useLocalStorage<SavedRecommendation[]>("rb-saved", []);
export const useCompare = () => useLocalStorage<string[]>("rb-compare", []);

const DEFAULT_FARMER: FarmerProfile = {
  name: "",
  mobile: "",
  preferredLang: "kn",
  taluk: "Kanakapura",
  village: "",
  farmArea: "",
  soilType: "Red sandy loam",
  waterSource: "Rainfed",
  isLoggedIn: false,
};

export function useFarmerAuth() {
  const [farmer, setFarmer, ready] = useLocalStorage<FarmerProfile>("rb-farmer-profile", DEFAULT_FARMER);

  const login = (mobile: string, name?: string) => {
    setFarmer((prev) => ({
      ...prev,
      mobile,
      name: name || prev.name || "Kisan Bandhu",
      isLoggedIn: true,
      registeredAt: prev.registeredAt || new Date().toISOString(),
    }));
  };

  const logout = () => {
    setFarmer((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    setFarmer((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return { farmer, login, logout, updateProfile, ready };
}
