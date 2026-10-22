import { describe, expect, it } from "vitest";
import { mockRecommendCrops, SAMPLE_INPUT } from "@/lib/recommend";
import { validateForm } from "@/lib/validate";

describe("mock recommendation engine", () => {
  it("returns exactly three crops", () => {
    expect(mockRecommendCrops(SAMPLE_INPUT)).toHaveLength(3);
  });
  it("is deterministic for the same input", () => {
    const a = mockRecommendCrops(SAMPLE_INPUT).map((r) => r.crop.id);
    const b = mockRecommendCrops(SAMPLE_INPUT).map((r) => r.crop.id);
    expect(a).toEqual(b);
  });
  it("suggests rice first for the Kharif high-water sample", () => {
    expect(mockRecommendCrops(SAMPLE_INPUT)[0]?.crop.id).toBe("rice");
  });
});

describe("form validation", () => {
  const base = { n: "90", p: "42", k: "43", ph: "6.5", temperature: "26", humidity: "80", rainfall: "200", state: "Bihar", district: "Patna", soilType: "", season: "Kharif" as const, water: "High" as const, irrigation: false, area: "", areaUnit: "acre" as const };
  it("rejects pH above 14", () => {
    expect(validateForm({ ...base, ph: "15" }).errors.ph).toBeTruthy();
  });
  it("rejects non-numeric nitrogen", () => {
    expect(validateForm({ ...base, n: "abc" }).errors.n).toBeTruthy();
  });
  it("rejects humidity above 100", () => {
    expect(validateForm({ ...base, humidity: "120" }).errors.humidity).toBeTruthy();
  });
  it("accepts valid input unchanged", () => {
    expect(validateForm(base).data?.n).toBe(90);
  });
});
