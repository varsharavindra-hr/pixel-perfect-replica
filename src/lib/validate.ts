import type { FarmInput } from "./recommend";
import type { Season, WaterNeed } from "./crops";
import type { Language } from "./i18n";

export interface FormState {
  taluk: string;
  village: string;
  soilType: string;
  season: Season | "";
  water: WaterNeed | "";
  irrigation: boolean;
  area: string;
  areaUnit: "acre" | "hectare";
  // Optional soil and weather test values
  n: string;
  p: string;
  k: string;
  ph: string;
  temperature: string;
  humidity: string;
  rainfall: string;
}

const OPTIONAL_NUMERIC_LIMITS: Record<string, { min: number; max: number; en: string; kn: string }> = {
  n: { min: 0, max: 400, en: "Nitrogen (N)", kn: "ಸಾರಜನಕ (N)" },
  p: { min: 0, max: 300, en: "Phosphorus (P)", kn: "ರಂಜಕ (P)" },
  k: { min: 0, max: 400, en: "Potassium (K)", kn: "ಪೊಟ್ಯಾಶ್ (K)" },
  ph: { min: 0, max: 14, en: "Soil pH", kn: "ಮಣ್ಣಿನ ಪಿ.ಎಚ್ (pH)" },
  temperature: { min: 5, max: 55, en: "Temperature", kn: "ತಾಪಮಾನ" },
  humidity: { min: 0, max: 100, en: "Humidity", kn: "ತೇವಾಂಶ" },
  rainfall: { min: 0, max: 3000, en: "Rainfall", kn: "ಮಳೆ ಪ್ರಮಾಣ" },
};

export function validateRegionalForm(f: FormState, lang: Language = "kn"): {
  errors: Partial<Record<keyof FormState, string>>;
  data: FarmInput | null;
} {
  const errors: Partial<Record<keyof FormState, string>> = {};

  // 1. Required core fields
  if (!f.taluk.trim()) {
    errors.taluk = lang === "kn" ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ತಾಲೂಕನ್ನು ಆಯ್ದುಕೊಳ್ಳಿ." : "Please select your taluk / region.";
  }

  if (!f.season) {
    errors.season = lang === "kn" ? "ದಯವಿಟ್ಟು ಬಿತ್ತನೆ ಹಂಗಾಮನ್ನು ಆಯ್ಕೆಮಾಡಿ." : "Please select a planting season.";
  }

  if (!f.water) {
    errors.water = lang === "kn" ? "ದಯವಿಟ್ಟು ನೀರಿನ ಲಭ್ಯತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ." : "Please select water availability.";
  }

  // 2. Area (optional, but if provided must be positive number)
  let area: number | undefined;
  if (f.area.trim()) {
    const rawArea = f.area.trim();
    if (!/^\d+(\.\d+)?$/.test(rawArea) || Number(rawArea) <= 0) {
      errors.area = lang === "kn" ? "ವಿಸ್ತೀರ್ಣವು ಸೊನ್ನೆಗಿಂತ ಹೆಚ್ಚಿರಬೇಕು." : "Area must be a valid positive number.";
    } else {
      area = Number(rawArea);
    }
  }

  // 3. Optional numeric soil & climate fields
  const optionalNumbers: Partial<Record<"n" | "p" | "k" | "ph" | "temperature" | "humidity" | "rainfall", number>> = {};

  for (const [key, meta] of Object.entries(OPTIONAL_NUMERIC_LIMITS)) {
    const raw = (f[key as keyof FormState] as string).trim();
    if (raw === "") {
      // Optional: leave empty without error!
      continue;
    }

    if (!/^-?\d+(\.\d+)?$/.test(raw)) {
      errors[key as keyof FormState] = lang === "kn"
        ? `${meta.kn} ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.`
        : `${meta.en} must be a number.`;
      continue;
    }

    const val = Number(raw);
    if (val < meta.min || val > meta.max) {
      errors[key as keyof FormState] = lang === "kn"
        ? `${meta.kn} ${meta.min} ಮತ್ತು ${meta.max} ನಡುವೆ ಇರಬೇಕು.`
        : `${meta.en} should be between ${meta.min} and ${meta.max}.`;
      continue;
    }

    optionalNumbers[key as keyof typeof optionalNumbers] = val;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, data: null };
  }

  return {
    errors,
    data: {
      taluk: f.taluk,
      village: f.village.trim() || undefined,
      soilType: f.soilType || undefined,
      season: f.season as Season,
      water: f.water as WaterNeed,
      irrigation: f.irrigation,
      area,
      areaUnit: f.areaUnit,
      ph: optionalNumbers.ph,
      n: optionalNumbers.n,
      p: optionalNumbers.p,
      k: optionalNumbers.k,
      temperature: optionalNumbers.temperature,
      humidity: optionalNumbers.humidity,
      rainfall: optionalNumbers.rainfall,
    },
  };
}
