import { CROPS, type Crop, type Season, type WaterNeed } from "./crops";

export interface FarmInput {
  n: number; p: number; k: number; ph: number;
  temperature: number; humidity: number; rainfall: number;
  state: string; district: string; soilType: string;
  season: Season; water: WaterNeed; irrigation: boolean;
  area?: number; areaUnit: "acre" | "hectare";
}

export interface MockResult {
  crop: Crop;
  demoScore: number; // 0-100, illustrative only
  reasons: string[];
  concerns: string[];
}

function rangeFit(v: number, [lo, hi]: [number, number]) {
  if (v >= lo && v <= hi) return 1;
  const span = Math.max(hi - lo, 1);
  const dist = v < lo ? lo - v : v - hi;
  return Math.max(0, 1 - dist / span);
}

const WATER_LEVEL: Record<WaterNeed, number> = { Low: 0, Moderate: 1, High: 2 };

/**
 * MOCK rule-based recommendation engine for demonstration.
 * Deterministic: same input always gives the same output. NOT a machine learning model.
 */
export function mockRecommendCrops(input: FarmInput, topN = 3): MockResult[] {
  return CROPS.map((crop) => {
    const reasons: string[] = [];
    const concerns: string[] = [];
    const checks: [string, number, number][] = [
      ["Soil pH", rangeFit(input.ph, crop.ph), 1.2],
      ["Temperature", rangeFit(input.temperature, crop.temp), 1.3],
      ["Rainfall", rangeFit(input.rainfall, crop.rainfall), 1.1],
      ["Humidity", rangeFit(input.humidity, crop.humidity), 0.7],
      ["Nitrogen", rangeFit(input.n, crop.npk.n), 0.6],
      ["Phosphorus", rangeFit(input.p, crop.npk.p), 0.6],
      ["Potassium", rangeFit(input.k, crop.npk.k), 0.6],
    ];
    let total = 0, weight = 0;
    for (const [label, fit, w] of checks) {
      total += fit * w; weight += w;
      if (fit === 1) reasons.push(`${label} is within the usual range for ${crop.name.toLowerCase()}`);
      else if (fit < 0.5) concerns.push(`${label} is outside the usual range`);
    }
    let score = total / weight;
    if (crop.seasons.includes(input.season)) { score += 0.12; reasons.unshift(`Commonly grown in ${input.season} season`); }
    else { score -= 0.25; concerns.push(`Not usually a ${input.season} crop`); }
    const available = WATER_LEVEL[input.water] + (input.irrigation ? 1 : 0);
    if (WATER_LEVEL[crop.water] > available) { score -= 0.15; concerns.push(`Needs ${crop.water.toLowerCase()} water`); }
    else reasons.push(`Water need (${crop.water.toLowerCase()}) matches your availability`);
    if (input.soilType && crop.soils.includes(input.soilType)) { score += 0.05; reasons.push(`Grows well in ${input.soilType.toLowerCase()} soil`); }
    const demoScore = Math.round(Math.max(0, Math.min(1, score)) * 100);
    return { crop, demoScore, reasons: reasons.slice(0, 4), concerns: concerns.slice(0, 3) };
  })
    .sort((a, b) => b.demoScore - a.demoScore || a.crop.name.localeCompare(b.crop.name))
    .slice(0, topN);
}

export function suitabilityLabel(score: number) {
  if (score >= 75) return "Good match (demo)";
  if (score >= 55) return "Possible match (demo)";
  return "Weak match (demo)";
}

export const SAMPLE_INPUT: FarmInput = {
  n: 90, p: 42, k: 43, ph: 6.5, temperature: 26, humidity: 80, rainfall: 200,
  state: "West Bengal", district: "Bardhaman", soilType: "Alluvial",
  season: "Kharif", water: "High", irrigation: true, area: 2, areaUnit: "acre",
};
