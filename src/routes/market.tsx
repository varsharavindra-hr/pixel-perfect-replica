import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/market")({
  head: () => seo("Market Prices", "Sample mandi prices and 6-month price trends for major crops."),
  component: MarketPage,
});

const MANDIS = ["Lasalgaon", "Azadpur", "Indore", "Rajkot", "Karnal"];
const rows = CROPS.map((c, i) => ({ c, mandi: MANDIS[i % MANDIS.length], price: c.pricePerQuintal, change: ((i * 37) % 9) - 4 }));
const trend = (base: number) => ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({ m, price: Math.round(base * (0.92 + ((i * 13) % 7) / 50)) }));

function MarketPage() {
  const [sel, setSel] = useState("wheat");
  const c = CROPS.find((x) => x.id === sel)!;
  return (
    <div className="space-y-5">
      <PageHeader title="Market Prices" subtitle="Check prices before you sell." icon={<TrendingUp />} />
      <Panel title="Today's mandi prices (₹/quintal)" action={<DemoBadge />}>
        <div className="divide-y">
          {rows.map(({ c, mandi, price, change }) => (
            <button key={c.id} onClick={() => setSel(c.id)} className={`flex w-full items-center gap-3 py-3 text-left ${sel === c.id ? "text-primary" : ""}`}>
              <span className="text-2xl">{c.emoji}</span>
              <div className="flex-1"><div className="font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{mandi} mandi</div></div>
              <div className="text-right"><div className="font-semibold">₹{price.toLocaleString("en-IN")}</div>
                <div className={`flex items-center justify-end text-xs ${change >= 0 ? "text-primary" : "text-destructive"}`}>{change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{Math.abs(change)}%</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={`${c.name} – 6 month trend`} action={<select aria-label="Crop" value={sel} onChange={(e) => setSel(e.target.value)} className={`${inputCls} w-40 py-1.5`}>{CROPS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend(c.pricePerQuintal)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={11} domain={["auto", "auto"]} />
              <Tooltip formatter={(v: number) => `₹${v}`} /><Line dataKey="price" stroke="var(--chart-1)" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Notice>Prices shown are sample figures. For live prices, check the government's eNAM or Agmarknet portals.</Notice>
    </div>
  );
}
