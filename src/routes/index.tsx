import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, FlaskConical, IndianRupee, CloudSun, Droplets, Thermometer, Wind, Lightbulb, ArrowRight } from "lucide-react";
import hero from "@/assets/hero-farm.jpg";
import { DemoBadge, Panel, CropArt } from "@/components/common";
import { NAV } from "@/components/AppShell";
import { useSaved } from "@/lib/storage";
import { CROPS } from "@/lib/crops";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KhetMitra – Smart Crop Advisor for Indian Farmers" },
      { name: "description", content: "Find crops that may suit your soil, weather, season and water. Free demo for Indian farmers." },
      { property: "og:title", content: "KhetMitra – Smart Crop Advisor" },
      { property: "og:description", content: "Find crops that may suit your soil, weather, season and water." },
    ],
  }),
  component: Dashboard,
});

const TIPS = [
  "Test your soil every 2–3 years using the Soil Health Card scheme.",
  "Rotate cereals with pulses to naturally improve soil nitrogen.",
  "Mulching can cut irrigation water needs by up to a quarter.",
];

function Dashboard() {
  const [saved] = useSaved();
  const seasonal = CROPS.filter((c) => c.seasons.includes("Rabi")).slice(0, 4);
  const nutrients = [
    { k: "Nitrogen", v: 72, max: 140, tone: "bg-chart-1" },
    { k: "Phosphorus", v: 38, max: 80, tone: "bg-chart-3" },
    { k: "Potassium", v: 45, max: 80, tone: "bg-chart-2" },
  ];
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl shadow-elevated">
        <img src={hero} alt="Green farm fields at sunrise" width={1600} height={800} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative max-w-xl p-6 py-10 sm:p-10 sm:py-14 text-primary-foreground">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Namaste, kisan ji 🙏</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Choose the right crop for your field</h1>
          <p className="mt-3 text-primary-foreground/90">Enter your soil and weather details. We will show crops that may suit your land, season and water.</p>
          <Link to="/recommend" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-elevated transition hover:brightness-105">
            <Sprout className="h-5 w-5" /> Get Crop Recommendations
          </Link>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { to: "/recommend", label: "Crop recommendation", icon: Sprout },
          { to: "/soil", label: "Soil analysis", icon: FlaskConical },
          { to: "/profit", label: "Compare crops", icon: IndianRupee },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition hover:border-primary">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><Icon className="h-5 w-5" /></div>
            <span className="font-semibold">{label}</span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Today's weather" action={<DemoBadge />}>
          <div className="flex items-center gap-4">
            <CloudSun className="h-14 w-14 text-warning" />
            <div><div className="text-4xl font-semibold">29°C</div><div className="text-muted-foreground">Partly cloudy · Nashik, MH</div></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg bg-muted p-3"><Droplets className="h-4 w-4 text-sky" />Humidity<br /><b>68%</b></div>
            <div className="rounded-lg bg-muted p-3"><Thermometer className="h-4 w-4 text-destructive" />Min/Max<br /><b>21°/31°</b></div>
            <div className="rounded-lg bg-muted p-3"><Wind className="h-4 w-4 text-primary" />Wind<br /><b>12 km/h</b></div>
          </div>
        </Panel>
        <Panel title="Soil nutrient summary" action={<DemoBadge />}>
          <div className="space-y-4">
            {nutrients.map((n) => (
              <div key={n.k}>
                <div className="mb-1 flex justify-between text-sm"><span>{n.k}</span><b>{n.v} kg/ha</b></div>
                <div className="h-2.5 rounded-full bg-muted"><div className={`h-full rounded-full ${n.tone}`} style={{ width: `${(n.v / n.max) * 100}%` }} /></div>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">pH 6.8 · Neutral — good for most crops.</p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Recent recommendations" className="lg:col-span-1">
          {saved.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing saved yet. <Link to="/recommend" className="font-semibold text-primary underline">Try a recommendation</Link>.</p>
          ) : (
            <ul className="space-y-2">{saved.slice(0, 4).map((s) => (
              <li key={s.id} className="flex justify-between rounded-lg bg-muted p-3 text-sm"><b>{s.cropName}</b><span className="text-muted-foreground">{s.season}</span></li>
            ))}</ul>
          )}
        </Panel>
        <Panel title="This Rabi season" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {seasonal.map((c) => (
              <Link key={c.id} to="/crops/$id" params={{ id: c.id }} className="flex flex-col items-center gap-2 rounded-xl border p-3 text-center hover:border-primary">
                <CropArt emoji={c.emoji} /><span className="text-sm font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Farming tips">
        <ul className="grid gap-3 sm:grid-cols-3">{TIPS.map((t) => (
          <li key={t} className="flex gap-2 rounded-xl bg-secondary/60 p-4 text-sm"><Lightbulb className="h-5 w-5 shrink-0 text-primary" />{t}</li>
        ))}</ul>
      </Panel>

      <Panel title="All tools">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {NAV.slice(1).map(({ to, en, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-2 rounded-lg p-3 text-sm font-medium hover:bg-muted"><Icon className="h-4 w-4 text-primary" />{en}</Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
