import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets } from "lucide-react";
import { PageHeader, Panel, Notice, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/water")({
  head: () => seo("Water & Irrigation", "Estimate crop water needs and compare flood, sprinkler and drip irrigation."),
  component: WaterPage,
});

// Approximate seasonal water need in mm (demo values)
const NEED: Record<string, number> = { Low: 350, Moderate: 550, High: 1200 };
const METHODS = [
  { name: "Flood / furrow", eff: 0.5, note: "Low cost, but much water is lost." },
  { name: "Sprinkler", eff: 0.75, note: "Good for wheat, pulses, vegetables." },
  { name: "Drip", eff: 0.9, note: "Best for sugarcane, cotton, fruits. Subsidy often available (PMKSY)." },
];

export function waterLitres(mm: number, acres: number, efficiency: number) {
  // 1 mm over 1 acre = 4046.86 litres
  return Math.round((mm * acres * 4046.86) / efficiency);
}

function WaterPage() {
  const [crop, setCrop] = useState("wheat");
  const [acres, setAcres] = useState("1");
  const c = CROPS.find((x) => x.id === crop)!;
  const a = Number(acres) > 0 ? Number(acres) : 0;
  const mm = NEED[c.water];
  return (
    <div className="space-y-5">
      <PageHeader title="Water & Irrigation" subtitle="See roughly how much water your crop needs." icon={<Droplets />} />
      <Panel title="Water calculator">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="font-semibold">Crop<select value={crop} onChange={(e) => setCrop(e.target.value)} className={`${inputCls} mt-1`}>{CROPS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="font-semibold">Area (acres)<input inputMode="decimal" value={acres} onChange={(e) => setAcres(e.target.value)} className={`${inputCls} mt-1`} />{!(Number(acres) > 0) && <span className="text-sm text-destructive">Enter a positive number.</span>}</label>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{c.name} needs about <b className="text-foreground">{mm} mm</b> of water in a season ({c.water.toLowerCase()} need, demo estimate). Rainfall reduces how much you must irrigate.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {METHODS.map((m) => (
            <div key={m.name} className="rounded-xl border p-4">
              <div className="font-semibold">{m.name}</div>
              <div className="mt-1 text-2xl font-semibold text-primary">{(waterLitres(mm, a, m.eff) / 100000).toFixed(1)} lakh L</div>
              <div className="text-xs text-muted-foreground">{Math.round(m.eff * 100)}% efficient · {m.note}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Water saving tips">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {["Irrigate early morning or evening to reduce evaporation.", "Use mulch (straw, plastic) to keep soil moist.", "Level your field so water spreads evenly.", "Water at critical stages: flowering and grain filling.", "Build a farm pond to store monsoon rain.", "Check soil moisture by hand before watering."].map((t) => <li key={t} className="rounded-lg bg-muted p-3">💧 {t}</li>)}
        </ul>
      </Panel>
      <Notice>All water figures are rough demo estimates. Actual needs depend on soil, weather, variety and crop stage.</Notice>
    </div>
  );
}
