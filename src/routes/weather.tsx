import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudSun, CloudRain, Sun, Cloud } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, DemoBadge } from "@/components/common";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/weather")({
  head: () => seo("Weather & Farming Calendar", "7-day sample forecast and a season-wise farming calendar for Indian crops."),
  component: WeatherPage,
});

const FORECAST = [
  { d: "Thu", hi: 31, lo: 21, rain: 0, icon: Sun }, { d: "Fri", hi: 30, lo: 22, rain: 10, icon: CloudSun },
  { d: "Sat", hi: 28, lo: 21, rain: 60, icon: CloudRain }, { d: "Sun", hi: 27, lo: 20, rain: 70, icon: CloudRain },
  { d: "Mon", hi: 29, lo: 20, rain: 20, icon: Cloud }, { d: "Tue", hi: 30, lo: 21, rain: 5, icon: Sun }, { d: "Wed", hi: 31, lo: 22, rain: 0, icon: Sun },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CAL: Record<string, { crop: string; sow: number[]; harvest: number[] }[]> = {
  Kharif: [{ crop: "Rice", sow: [5, 6], harvest: [9, 10] }, { crop: "Cotton", sow: [5, 6], harvest: [10, 11, 0] }, { crop: "Maize", sow: [5, 6], harvest: [8, 9] }, { crop: "Pigeon pea", sow: [5, 6], harvest: [11, 0] }],
  Rabi: [{ crop: "Wheat", sow: [10, 11], harvest: [2, 3] }, { crop: "Mustard", sow: [9, 10], harvest: [1, 2] }, { crop: "Chickpea", sow: [9, 10], harvest: [1, 2] }],
  Zaid: [{ crop: "Watermelon", sow: [1, 2], harvest: [4, 5] }, { crop: "Moong", sow: [2, 3], harvest: [4, 5] }],
};

function WeatherPage() {
  const [season, setSeason] = useState("Rabi");
  return (
    <div className="space-y-5">
      <PageHeader title="Weather & Farming Calendar" subtitle="Plan sowing and spraying around the weather." icon={<CloudSun />} />
      <Panel title="7-day forecast · Nashik" action={<DemoBadge />}>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {FORECAST.map(({ d, hi, lo, rain, icon: I }) => (
            <div key={d} className="rounded-xl bg-muted p-3 text-center">
              <div className="text-sm font-semibold">{d}</div><I className="mx-auto my-2 h-7 w-7 text-primary" />
              <div className="text-sm"><b>{hi}°</b> / {lo}°</div><div className="text-xs text-sky">{rain}% rain</div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="d" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Area dataKey="hi" name="Max °C" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.25} />
              <Area dataKey="rain" name="Rain chance %" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">🌧️ Rain likely Sat–Sun. Avoid spraying pesticides or fertilizer on Friday evening.</p>
      </Panel>
      <Panel title="Farming calendar" action={
        <div className="flex gap-1 rounded-lg bg-muted p-1">{Object.keys(CAL).map((s) => (
          <button key={s} onClick={() => setSeason(s)} aria-pressed={season === s} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${season === s ? "bg-card shadow-card" : ""}`}>{s}</button>
        ))}</div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr><th className="p-2 text-left">Crop</th>{MONTHS.map((m) => <th key={m} className="p-1 text-xs font-medium text-muted-foreground">{m}</th>)}</tr></thead>
            <tbody>{CAL[season].map((r) => (
              <tr key={r.crop} className="border-t"><td className="p-2 font-semibold">{r.crop}</td>
                {MONTHS.map((m, i) => <td key={m} className="p-1"><div className={`h-6 rounded ${r.sow.includes(i) ? "bg-primary" : r.harvest.includes(i) ? "bg-warning" : "bg-muted"}`} /></td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-4 text-xs"><span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-primary" />Sowing</span><span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-warning" />Harvest</span></div>
      </Panel>
    </div>
  );
}
