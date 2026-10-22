import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Search, Droplets, Clock } from "lucide-react";
import { PageHeader, CropArt, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Explorer – KhetMitra" },
      { name: "description", content: "Browse crops by season, type and water need with simple growing guides." },
      { property: "og:title", content: "Crop Explorer – KhetMitra" },
      { property: "og:description", content: "Browse crops by season, type and water need." },
    ],
  }),
  component: CropsLayout,
});

function CropsLayout() {
  const { pathname } = useLocation();
  return pathname === "/crops" || pathname === "/crops/" ? <Explorer /> : <Outlet />;
}

function Explorer() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [season, setSeason] = useState("");
  const [water, setWater] = useState("");
  const list = CROPS.filter((c) =>
    (!q || `${c.name} ${c.hindi}`.toLowerCase().includes(q.toLowerCase())) &&
    (!type || c.type === type) && (!season || c.seasons.includes(season as never)) && (!water || c.water === water));
  return (
    <div>
      <PageHeader title="Crop Explorer" subtitle="Learn about crops grown across India." icon={<BookOpen />} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <label className="relative sm:col-span-4 lg:col-span-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input aria-label="Search crops" placeholder="Search crop…" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputCls} pl-9`} />
        </label>
        <select aria-label="Crop type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
          <option value="">All types</option>{["Cereal", "Pulse", "Oilseed", "Cash", "Fruit", "Vegetable"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Season" value={season} onChange={(e) => setSeason(e.target.value)} className={inputCls}>
          <option value="">All seasons</option>{["Kharif", "Rabi", "Zaid"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Water need" value={water} onChange={(e) => setWater(e.target.value)} className={inputCls}>
          <option value="">Any water need</option>{["Low", "Moderate", "High"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      {list.length === 0 && <p className="text-muted-foreground">No crops match these filters.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} to="/crops/$id" params={{ id: c.id }} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:border-primary">
            <div className="flex items-center gap-3"><CropArt emoji={c.emoji} />
              <div><h2 className="text-lg font-semibold group-hover:text-primary">{c.name}</h2><div className="text-sm text-muted-foreground">{c.type} · {c.hindi}</div></div>
            </div>
            <p className="mt-3 text-sm">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {c.seasons.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">{s}</span>)}
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1"><Droplets className="h-3 w-3" />{c.water}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1"><Clock className="h-3 w-3" />{c.durationDays[0]}–{c.durationDays[1]} d</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.temp[0]}–{c.temp[1]}°C · {c.rainfall[0]}–{c.rainfall[1]} mm rain · {c.soils.join(", ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
