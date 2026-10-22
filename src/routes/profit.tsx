import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Notice, DemoBadge, CropArt, inputCls } from "@/components/common";
import { CROPS, getCrop } from "@/lib/crops";
import { useCompare } from "@/lib/storage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/profit")({
  head: () => seo("Crop Cost & Profit Comparison", "Compare sample cost, yield and income per acre for up to three crops."),
  component: ProfitPage,
});

export function profitPerAcre(cost: number, yieldQ: number, price: number) {
  return yieldQ * price - cost;
}
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function ProfitPage() {
  const [ids, setIds] = useCompare();
  const list = (ids.length ? ids : ["wheat", "chickpea", "mustard"]).map(getCrop).filter(Boolean) as typeof CROPS;
  const data = list.map((c) => ({ name: c.name.split(" ")[0], Cost: c.costPerAcre, Income: c.yieldPerAcre * c.pricePerQuintal, Profit: profitPerAcre(c.costPerAcre, c.yieldPerAcre, c.pricePerQuintal) }));
  return (
    <div className="space-y-5">
      <PageHeader title="Cost & Profit Comparison" subtitle="Compare up to 3 crops per acre." icon={<IndianRupee />}>
        <select aria-label="Add crop" value="" onChange={(e) => e.target.value && setIds([...list.map((c) => c.id).filter((x) => x !== e.target.value), e.target.value].slice(-3))} className={`${inputCls} sm:w-56`}>
          <option value="">+ Add crop</option>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        {list.map((c) => {
          const p = profitPerAcre(c.costPerAcre, c.yieldPerAcre, c.pricePerQuintal);
          return (
            <div key={c.id} className="relative rounded-2xl border bg-card p-5 shadow-card">
              <button aria-label={`Remove ${c.name}`} onClick={() => setIds(list.map((x) => x.id).filter((x) => x !== c.id))} className="absolute right-3 top-3 rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
              <div className="flex items-center gap-3"><CropArt emoji={c.emoji} size="sm" /><h2 className="text-lg font-semibold">{c.name}</h2></div>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt>Cost</dt><dd>{inr(c.costPerAcre)}</dd></div>
                <div className="flex justify-between"><dt>Yield</dt><dd>{c.yieldPerAcre} qtl</dd></div>
                <div className="flex justify-between"><dt>Price</dt><dd>{inr(c.pricePerQuintal)}/qtl</dd></div>
                <div className="flex justify-between"><dt>Duration</dt><dd>{c.durationDays[1]} days</dd></div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold"><dt>Est. profit</dt><dd className={p >= 0 ? "text-primary" : "text-destructive"}>{inr(p)}</dd></div>
              </dl>
            </div>
          );
        })}
      </div>
      <Panel title="Per acre comparison" action={<DemoBadge />}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={11} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v: number) => inr(v)} /><Legend />
              <Bar dataKey="Cost" fill="var(--chart-3)" radius={[6, 6, 0, 0]} /><Bar dataKey="Income" fill="var(--chart-2)" radius={[6, 6, 0, 0]} /><Bar dataKey="Profit" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Notice tone="warn">Costs, yields and prices are sample figures. Real profit depends on your inputs, labour, weather, and the price you actually get at the mandi.</Notice>
    </div>
  );
}
