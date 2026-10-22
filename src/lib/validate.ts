import type { FarmInput } from "./recommend";
import type { Season, WaterNeed } from "./crops";

export interface FormState {
  n: string; p: string; k: string; ph: string;
  temperature: string; humidity: string; rainfall: string;
  state: string; district: string; soilType: string;
  season: Season | ""; water: WaterNeed | ""; irrigation: boolean;
  area: string; areaUnit: "acre" | "hectare";
}

const LIMITS: Record<string, [number, number, string]> = {
  n: [0, 300, "Nitrogen"], p: [0, 300, "Phosphorus"], k: [0, 400, "Potassium"],
  ph: [0, 14, "pH"], temperature: [-10, 55, "Temperature"], humidity: [0, 100, "Humidity"], rainfall: [0, 5000, "Rainfall"],
};

export function validateForm(f: FormState): { errors: Partial<Record<keyof FormState, string>>; data: FarmInput | null } {
  const errors: Partial<Record<keyof FormState, string>> = {};
  const nums = {} as Record<"n"|"p"|"k"|"ph"|"temperature"|"humidity"|"rainfall", number>;
  for (const [key, [min, max, label]] of Object.entries(LIMITS)) {
    const raw = (f[key as keyof FormState] as string).trim();
    if (raw === "") { errors[key as keyof FormState] = `Please enter ${label.toLowerCase()}.`; continue; }
    if (!/^-?\d+(\.\d+)?$/.test(raw)) { errors[key as keyof FormState] = `${label} must be a number.`; continue; }
    const v = Number(raw);
    if (v < min || v > max) { errors[key as keyof FormState] = `${label} should be between ${min} and ${max}.`; continue; }
    nums[key as keyof typeof nums] = v;
  }
  if (!f.state) errors.state = "Please select your state.";
  if (!f.district) errors.district = "Please select your district.";
  if (!f.season) errors.season = "Please choose a season.";
  if (!f.water) errors.water = "Please choose water availability.";
  let area: number | undefined;
  if (f.area.trim()) {
    if (!/^\d+(\.\d+)?$/.test(f.area.trim()) || Number(f.area) <= 0) errors.area = "Area must be a positive number.";
    else area = Number(f.area);
  }
  if (Object.keys(errors).length) return { errors, data: null };
  return {
    errors,
    data: {
      n: nums.n, p: nums.p, k: nums.k, ph: nums.ph, temperature: nums.temperature, humidity: nums.humidity, rainfall: nums.rainfall,
      state: f.state, district: f.district, soilType: f.soilType, season: f.season as Season, water: f.water as WaterNeed,
      irrigation: f.irrigation, ...(area !== undefined ? { area } : {}), areaUnit: f.areaUnit,
    },
  };
}
