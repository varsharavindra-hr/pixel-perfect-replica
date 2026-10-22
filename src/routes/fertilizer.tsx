import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/fertilizer")({
  head: () => seo("Fertilizer Guidance", "Simple demo fertilizer plan in bags of Urea, DAP and MOP per acre."),
  component: FertPage,
});

// Nutrient content: Urea 46% N, DAP 18% N + 46% P2O5, MOP 60% K2O. 1 bag = 50 kg (urea 45 kg).
export function fertilizerPlan(nKgHa: number, pKgHa: number, kKgHa: number, acres: number) {
  const ha = acres * 0.4047;
  const dap = (pKgHa / 0.46) * ha;
  const urea = Math.max(0, (nKgHa - dap / ha * 0.18) / 0.46) * ha;
  const mop = (kKgHa / 0.6) * ha;
  return { urea: Math.round(urea), dap: Math.round(dap), mop: Math.round(mop) };
}

function FertPage() {
  const [crop, setCrop] = useState("wheat");
  const [acres, setAcres] = useState("1");
  const c = CROPS.find((x) => x.id === crop)!;
  const mid = (r: [number, number]) => (r[0] + r[1]) / 2;
  const a = Number(acres) > 0 ? Number(acres) : 0;
  const plan = fertilizerPlan(mid(c.npk.n), mid(c.npk.p), mid(c.npk.k), a);
  const items = [
    { name: "Urea", kg: plan.urea, bag: 45, when: "Split: ½ at sowing, ½ at 30–45 days" },
    { name: "DAP", kg: plan.dap, bag: 50, when: "Full dose at sowing, near seed" },
    { name: "MOP (Potash)", kg: plan.mop, bag: 50, when: "Full dose at sowing" },
  ];
  return (
    <div className="space-y-5">
      <PageHeader title="Fertilizer Guidance" subtitle="A simple starting plan. Adjust using your Soil Health Card." icon={<Leaf />} />
      <Panel title="Your plan" action={<DemoBadge label="Demo calculation" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="font-semibold">Crop<select value={crop} onChange={(e) => setCrop(e.target.value)} className={`${inputCls} mt-1`}>{CROPS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="font-semibold">Area (acres)<input inputMode="decimal" value={acres} onChange={(e) => setAcres(e.target.value)} className={`${inputCls} mt-1`} /></label>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Target N-P-K for {c.name}: {mid(c.npk.n)}-{mid(c.npk.p)}-{mid(c.npk.k)} kg/ha (sample).</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {items.map((i) => (
            <div key={i.name} className="rounded-xl bg-secondary/60 p-4">
              <div className="font-semibold">{i.name}</div>
              <div className="text-2xl font-semibold text-primary">{i.kg} kg</div>
              <div className="text-sm">≈ {(i.kg / i.bag).toFixed(1)} bags</div>
              <div className="mt-2 text-xs text-muted-foreground">{i.when}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Organic options">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li className="rounded-lg bg-muted p-3">🐄 Farmyard manure: 4–5 tonnes/acre before sowing</li>
          <li className="rounded-lg bg-muted p-3">🪱 Vermicompost: 1–2 tonnes/acre</li>
          <li className="rounded-lg bg-muted p-3">🌱 Green manure (dhaincha) before rice</li>
          <li className="rounded-lg bg-muted p-3">🧫 Biofertilizers: Rhizobium, PSB, Azotobacter</li>
        </ul>
      </Panel>
      <Notice tone="warn">This is a simplified demo calculation. Always follow the fertilizer dose on your Soil Health Card or advice from your agriculture officer. Too much fertilizer wastes money and harms soil.</Notice>
    </div>
  );
}
