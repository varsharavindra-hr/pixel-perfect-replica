import { CROPS, type Crop, type Season, type WaterNeed } from "./crops";

export interface FarmInput {
  taluk: string;
  village?: string | undefined;
  soilType?: string | undefined;
  season: Season;
  water: WaterNeed;
  irrigation: boolean;
  area?: number | undefined;
  areaUnit: "acre" | "hectare";
  // Optional measurements (Soil Health Card & weather)
  ph?: number | undefined;
  n?: number | undefined;
  p?: number | undefined;
  k?: number | undefined;
  rainfall?: number | undefined;
  temperature?: number | undefined;
  humidity?: number | undefined;
}

export interface RecommendationResult {
  crop: Crop;
  matchScore: number; // 0-100 score based on regional agronomy
  matchLevel: "High" | "Moderate" | "Low";
  reasons: string[];
  reasonsKn: string[];
  concerns: string[];
  concernsKn: string[];
  soilSuitability: string;
  soilSuitabilityKn: string;
  waterSuitability: string;
  waterSuitabilityKn: string;
  missingDataNote?: string | undefined;
  missingDataNoteKn?: string | undefined;
}

function rangeFit(v: number, [lo, hi]: [number, number]) {
  if (v >= lo && v <= hi) return 1;
  const span = Math.max(hi - lo, 1);
  const dist = v < lo ? lo - v : v - hi;
  return Math.max(0, 1 - dist / span);
}

const WATER_LEVEL: Record<WaterNeed, number> = { Low: 0, Moderate: 1, High: 2 };

// Regional baselines for Southern Bengaluru / Zone 5 when farmer has not conducted a soil test
const REGIONAL_DEFAULTS = {
  ph: 6.3, // Typical slightly acidic to neutral red loam pH in Harohalli/Kanakapura
  temperature: 26, // Annual mean temperature
  humidity: 65,
  rainfallKharif: 90, // mm average peak month
  rainfallRabi: 50,
  rainfallSummer: 25,
};

/**
 * Agronomic rule-based recommendation engine calibrated for Harohalli, Kanakapura & Zone 5.
 * Transparent, deterministic, and explains limitations when soil tests are omitted.
 */
export function recommendRegionalCrops(input: FarmInput, topN = 4): RecommendationResult[] {
  const hasSoilTest = input.ph !== undefined || input.n !== undefined || input.p !== undefined || input.k !== undefined;

  // Expected rainfall based on season if not specified
  const effectiveRainfall = input.rainfall ?? (input.season === "Kharif" ? REGIONAL_DEFAULTS.rainfallKharif : input.season === "Rabi" ? REGIONAL_DEFAULTS.rainfallRabi : REGIONAL_DEFAULTS.rainfallSummer);
  const effectiveTemp = input.temperature ?? REGIONAL_DEFAULTS.temperature;
  const effectiveHumidity = input.humidity ?? REGIONAL_DEFAULTS.humidity;
  const effectivePh = input.ph ?? REGIONAL_DEFAULTS.ph;

  const results: RecommendationResult[] = [];

  for (const crop of CROPS) {
    const reasons: string[] = [];
    const reasonsKn: string[] = [];
    const concerns: string[] = [];
    const concernsKn: string[] = [];

    // 1. Season Fit (Critical factor)
    let seasonScore = 0;
    if (crop.seasons.includes(input.season) || crop.seasons.includes("Perennial")) {
      seasonScore = 1.0;
      reasons.push(`Naturally suited for the ${input.season} planting window in this region`);
      reasonsKn.push(`ಈ ಭಾಗದಲ್ಲಿ ${input.season === "Kharif" ? "ಮುಂಗಾರು" : input.season === "Rabi" ? "ಹಿಂಗಾರು" : "ಬೇಸಿಗೆ"} ಹಂಗಾಮಿನ ಬಿತ್ತನೆಗೆ ನೈಸರ್ಗಿಕವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ`);
    } else {
      seasonScore = 0.2;
      concerns.push(`Not traditionally sown during ${input.season} in Southern Bengaluru`);
      concernsKn.push(`ದಕ್ಷಿಣ ಬೆಂಗಳೂರು ಭಾಗದಲ್ಲಿ ${input.season} ಹಂಗಾಮಿಗೆ ಈ ಬೆಳೆ ಸಾಂಪ್ರದಾಯಿಕವಲ್ಲ`);
    }

    // 2. Water Availability & Irrigation Access
    let waterScore = 0;
    const availableCapacity = WATER_LEVEL[input.water] + (input.irrigation ? 1 : 0);
    const requiredCapacity = WATER_LEVEL[crop.water];

    if (availableCapacity >= requiredCapacity) {
      waterScore = 1.0;
      const irrText = input.irrigation ? "with your available irrigation" : "under rainfed conditions";
      const irrTextKn = input.irrigation ? "ನಿಮ್ಮಲ್ಲಿರುವ ನೀರಾವರಿ ಆಸರೆಯಲ್ಲಿ" : "ಮಳೆಯಾಶ್ರಿತವಾಗಿ";
      reasons.push(`Water requirement (${crop.water.toLowerCase()}) aligns ${irrText}`);
      reasonsKn.push(`ಬೆಳೆಯ ನೀರಿನ ಬೇಡಿಕೆ (${crop.water === "Low" ? "ಕಡಿಮೆ" : crop.water === "Moderate" ? "ಸಾಧಾರಣ" : "ಹೆಚ್ಚು"}) ${irrTextKn} ಸರಿಹೊಂದುತ್ತದೆ`);
    } else {
      waterScore = 0.3;
      concerns.push(`Requires higher water supply than currently available without assured borewell/drip`);
      concernsKn.push(`ಖಚಿತ ಬೋರ್‌ವೆಲ್ ಅಥವಾ ಹನಿ ನೀರಾವರಿ ಇಲ್ಲದೆ ಬೆಳೆಯಲು ನೀರಿನ ಕೊರತೆಯಾಗಬಹುದು`);
    }

    // 3. Soil Suitability
    let soilScore = 0.7; // Default baseline for regional red soil
    let soilSuit = "Compatible with local red soils";
    let soilSuitKn = "ಸ್ಥಳೀಯ ಕೆಂಪು ಮಣ್ಣಿಗೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ";

    if (input.soilType) {
      if (crop.soils.includes(input.soilType)) {
        soilScore = 1.0;
        soilSuit = `Optimal for ${input.soilType}`;
        soilSuitKn = `${input.soilType} ಮಣ್ಣಿಗೆ ಅತ್ಯುತ್ತಮ`;
        reasons.push(`Documented excellent performance in ${input.soilType}`);
        reasonsKn.push(`${input.soilType} ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮ ಇಳುವರಿ ದಾಖಲಾಗಿದೆ`);
      } else {
        soilScore = 0.4;
        soilSuit = `Sub-optimal for ${input.soilType}`;
        soilSuitKn = `${input.soilType} ಮಣ್ಣಿಗೆ ಅಷ್ಟು ಸೂಕ್ತವಲ್ಲ`;
        concerns.push(`Prefers ${crop.soils.join(" or ")}; may yield lower in ${input.soilType}`);
        concernsKn.push(`${crop.soils.join(" ಅಥವಾ ")} ಮಣ್ಣಿಗೆ ಹೆಚ್ಚು ಸೂಕ್ತ; ${input.soilType} ಮಣ್ಣಿನಲ್ಲಿ ಇಳುವರಿ ಸಾಧಾರಣ`);
      }
    }

    // 4. Climate & Rainfall Fit
    const tempFit = rangeFit(effectiveTemp, crop.temp);
    const rainFit = rangeFit(effectiveRainfall, crop.rainfall);
    const phFit = rangeFit(effectivePh, crop.ph);

    // 5. Nutrient Fit (if provided by Soil Health Card)
    let nutrientScore = 0.8;
    if (input.n !== undefined && input.p !== undefined && input.k !== undefined) {
      const nFit = rangeFit(input.n, crop.npk.n);
      const pFit = rangeFit(input.p, crop.npk.p);
      const kFit = rangeFit(input.k, crop.npk.k);
      nutrientScore = (nFit + pFit + kFit) / 3;
      if (nutrientScore > 0.8) {
        reasons.push(`Your Soil Health Card nutrients (N-P-K) match this crop's requirements`);
        reasonsKn.push(`ನಿಮ್ಮ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋಷಕಾಂಶಗಳು (ಸಾರಜನಕ, ರಂಜಕ, ಪೊಟ್ಯಾಶ್) ಬೆಳೆಗೆ ಸರಿಹೊಂದುತ್ತವೆ`);
      } else {
        concerns.push(`Soil test indicates fertilizer amendment required to match target yields`);
        concernsKn.push(`ಉತ್ತಮ ಇಳುವರಿ ಪಡೆಯಲು ಮಣ್ಣು ಪರೀಕ್ಷೆಗೆ ತಕ್ಕಂತೆ ಹೆಚ್ಚುವರಿ ಗೊಬ್ಬರ ನೀಡಬೇಕಾಗುತ್ತದೆ`);
      }
    }

    // Weighted Agronomic Calculation
    const totalScore = (
      seasonScore * 0.35 +
      waterScore * 0.25 +
      soilScore * 0.15 +
      tempFit * 0.10 +
      rainFit * 0.10 +
      phFit * 0.05
    ) * (hasSoilTest ? nutrientScore : 0.95);

    const matchScore = Math.round(Math.max(10, Math.min(99, totalScore * 100)));

    // Categorize Match Level
    let matchLevel: "High" | "Moderate" | "Low" = "Low";
    if (matchScore >= 75) matchLevel = "High";
    else if (matchScore >= 50) matchLevel = "Moderate";

    // Add local rationale
    if (crop.establishedLocal) {
      reasons.push(`Proven track record in Ramanagara / Kanakapura regional trials`);
      reasonsKn.push(`ರಾಮನಗರ / ಕನಕಪುರ ಭಾಗದಲ್ಲಿ ದೃಢೀಕೃತ ಫಲಿತಾಂಶ ನೀಡಿದ ಸಾಂಪ್ರದಾಯಿಕ ಬೆಳೆ`);
    }

    // Missing data note if no soil test
    const missingDataNote = !hasSoilTest
      ? "Soil test values not entered. Scored against Zone 5 regional average. A laboratory Soil Health Card test will refine this recommendation."
      : undefined;
    const missingDataNoteKn = !hasSoilTest
      ? "ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಅಂಕಿ-ಅಂಶಗಳನ್ನು ನಮೂದಿಸಿಲ್ಲ. ವಲಯ 5 ರ ಪ್ರಾದೇಶಿಕ ಸರಾಸರಿಯಂತೆ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ. ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿದರೆ ಹೆಚ್ಚು ನಿಖರ ಫಲಿತಾಂಶ ಲಭ್ಯವಾಗುತ್ತದೆ."
      : undefined;

    results.push({
      crop,
      matchScore,
      matchLevel,
      reasons: reasons.slice(0, 3),
      reasonsKn: reasonsKn.slice(0, 3),
      concerns: concerns.slice(0, 2),
      concernsKn: concernsKn.slice(0, 2),
      soilSuitability: soilSuit,
      soilSuitabilityKn: soilSuitKn,
      waterSuitability: `${crop.water} water requirement`,
      waterSuitabilityKn: `${crop.water === "Low" ? "ಕಡಿಮೆ" : crop.water === "Moderate" ? "ಸಾಧಾರಣ" : "ಹೆಚ್ಚು"} ನೀರಿನ ಅವಶ್ಯಕತೆ`,
      missingDataNote,
      missingDataNoteKn,
    });
  }

  // Sort by match score descending, prioritizing well-established local crops on ties
  return results
    .sort((a, b) => b.matchScore - a.matchScore || (b.crop.establishedLocal ? 1 : 0) - (a.crop.establishedLocal ? 1 : 0))
    .slice(0, topN);
}

export const SAMPLE_REGIONAL_INPUT: FarmInput = {
  taluk: "Kanakapura",
  village: "Sathnur",
  soilType: "Red sandy loam",
  season: "Kharif",
  water: "Low",
  irrigation: false,
  area: 2.5,
  areaUnit: "acre",
  // Optional soil test left empty by default to show clean optional behavior!
};
