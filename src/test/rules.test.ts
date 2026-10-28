import { describe, expect, it } from "vitest";
import { recommendRegionalCrops, SAMPLE_REGIONAL_INPUT } from "@/lib/recommend";
import { validateRegionalForm, type FormState } from "@/lib/validate";

describe("Raitha Bandhu Regional Recommendation Engine", () => {
  it("returns suitable regional crops", () => {
    const results = recommendRegionalCrops(SAMPLE_REGIONAL_INPUT);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(4);
  });

  it("is deterministic for the same regional input", () => {
    const a = recommendRegionalCrops(SAMPLE_REGIONAL_INPUT).map((r) => r.crop.id);
    const b = recommendRegionalCrops(SAMPLE_REGIONAL_INPUT).map((r) => r.crop.id);
    expect(a).toEqual(b);
  });

  it("suggests Ragi (Finger Millet) as top crop for Kanakapura rainfed Kharif red soils", () => {
    const top = recommendRegionalCrops(SAMPLE_REGIONAL_INPUT)[0]?.crop.id;
    expect(top).toBe("ragi");
  });
});

describe("Regional Form Validation", () => {
  const base: FormState = {
    taluk: "Kanakapura",
    village: "Sathnur",
    soilType: "Red sandy loam",
    season: "Kharif",
    water: "Low",
    irrigation: false,
    area: "2.5",
    areaUnit: "acre",
    n: "",
    p: "",
    k: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  };

  it("accepts valid input with optional soil test values left blank", () => {
    const res = validateRegionalForm(base, "en");
    expect(res.data).not.toBeNull();
    expect(res.data?.taluk).toBe("Kanakapura");
    expect(res.data?.ph).toBeUndefined();
  });

  it("rejects invalid numeric pH when provided", () => {
    const res = validateRegionalForm({ ...base, ph: "15" }, "en");
    expect(res.errors.ph).toBeTruthy();
  });

  it("rejects non-numeric nitrogen when provided", () => {
    const res = validateRegionalForm({ ...base, n: "invalid" }, "en");
    expect(res.errors.n).toBeTruthy();
  });

  it("rejects empty taluk", () => {
    const res = validateRegionalForm({ ...base, taluk: "" }, "en");
    expect(res.errors.taluk).toBeTruthy();
  });
});
