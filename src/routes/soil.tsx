import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/soil")({
  head: () => seo("Soil Health Analysis", "Enter your Soil Health Card values to see a simple nutrient summary."),
  component: SoilPage,
});

// Simplified demo thresholds (kg/ha) loosely based on common Soil Health Card ratings.
const LEVELS: Record<"n"|"p"|"k", [number, number]> = { n: [280, 560], p: [10, 25], k: [110, 280] };
function rate(v: number, [lo, hi]: [number, number]) { return v < lo ? "Low" : v > hi ? "High" : "Medium"; }
function phRate(ph: number) { return ph < 5.5 ? "Strongly acidic" : ph < 6.5 ? "Slightly acidic" : ph <= 7.5 ? "Neutral" : ph <= 8.5 ? "Alkaline" : "Strongly alkaline"; }

function SoilPage() {
  const [v, setV] = useState({ n: "240", p: "18", k: "190", ph: "6.8", moisture: "22", oc: "0.55", ec: "0.4", card: "MH-NSK-2026-0142", date: "2026-03-14" });
  const num = (k: keyof typeof v) => { const x = Number(v[k]); return Number.isFinite(x) ? x : 0; };
  const data = [
    { name: "Nitrogen", value: num("n"), mid: (LEVELS.n[0] + LEVELS.n[1]) / 2 },
    { name: "Phosphorus", value: num("p"), mid: (LEVELS.p[0] + LEVELS.p[1]) / 2 },
    { name: "Potassium", value: num("k"), mid: (LEVELS.k[0] + LEVELS.k[1]) / 2 },
  ].map((d) => ({ ...d, pct: Math.round((d.value / d.mid) * 100) }));
  const cards = [
    { k: "Nitrogen (N)", val: `${v.n} kg/ha`, r: rate(num("n"), LEVELS.n), tip: "Helps leaves grow green." },
    { k: "Phosphorus (P)", val: `${v.p} kg/ha`, r: rate(num("p"), LEVELS.p), tip: "Helps roots and flowers." },
    { k: "Potassium (K)", val: `${v.k} kg/ha`, r: rate(num("k"), LEVELS.k), tip: "Helps grain quality and disease resistance." },
    { k: "Soil pH", val: v.ph, r: phRate(num("ph")), tip: "Affects how plants take up nutrients." },
  ];
  const tone = (r: string) => r === "Low" || r.includes("Strongly") ? "bg-destructive/15 text-destructive" : r === "High" || r.includes("Slightly") || r === "Alkaline" ? "bg-warning/25 text-warning-foreground" : "bg-success/15 text-primary";
  const fields: [keyof typeof v, string][] = [["n", "Available Nitrogen (kg/ha)"], ["p", "Available Phosphorus (kg/ha)"], ["k", "Available Potassium (kg/ha)"], ["ph", "pH"], ["moisture", "Moisture % (optional)"], ["oc", "Organic Carbon %"], ["ec", "EC (dS/m)"]];
  return (
    <div className="space-y-5">
      <PageHeader title="Soil Health Analysis" subtitle="Type values from your Soil Health Card. The summary updates as you type." icon={<FlaskConical />} />
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title="Soil report entry" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-sm font-semibold">Soil Health Card no.<input value={v.card} onChange={(e) => setV({ ...v, card: e.target.value })} className={`${inputCls} mt-1`} /></label>
            <label className="col-span-2 text-sm font-semibold">Test date<input type="date" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} className={`${inputCls} mt-1`} /></label>
            {fields.map(([k, l]) => (
              <label key={k} className="text-sm font-semibold">{l}
                <input inputMode="decimal" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className={`${inputCls} mt-1 ${v[k] !== "" && !Number.isFinite(Number(v[k])) ? "border-destructive" : ""}`} />
              </label>
            ))}
          </div>
        </Panel>
        <div className="space-y-5 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3">
            {cards.map((c) => (
              <div key={c.k} className="rounded-2xl border bg-card p-4 shadow-card">
                <div className="text-sm text-muted-foreground">{c.k}</div>
                <div className="text-2xl font-semibold">{c.val}</div>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${tone(c.r)}`}>{c.r}</span>
                <p className="mt-2 text-xs text-muted-foreground">{c.tip}</p>
              </div>
            ))}
          </div>
          <Panel title="Nutrients vs. medium level" action={<DemoBadge label="Demo thresholds" />}>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={12} /><YAxis unit="%" fontSize={12} />
                  <Tooltip formatter={(x) => [`${x}% of medium`, "Level"]} />
                  <ReferenceLine y={100} stroke="var(--primary)" strokeDasharray="4 4" />
                  <Bar dataKey="pct" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
      <Panel title="What these mean">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p><b>NPK</b> are the three main plant foods. Low values mean the crop may need fertilizer or manure.</p>
          <p><b>pH</b> shows if soil is sour (acidic) or salty-bitter (alkaline). Most crops like 6–7.5.</p>
          <p><b>Organic carbon</b> shows how much humus is in the soil. Above 0.75% is good.</p>
          <p><b>EC</b> shows salt level. Above 1 dS/m may harm sensitive crops.</p>
        </div>
      </Panel>
      <Notice tone="warn">Proper soil interpretation depends on measurement units, laboratory methods, soil conditions and crop needs. These ratings are simplified demo thresholds — follow the advice printed on your Soil Health Card or from your soil testing lab.</Notice>
    </div>
  );
}
