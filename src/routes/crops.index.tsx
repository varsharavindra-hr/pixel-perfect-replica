import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Search, Droplets, Clock, CheckCircle, ShieldAlert } from "lucide-react";
import { PageHeader, CropArt, inputCls, DemoBadge } from "@/components/common";
import { CROPS, type CropType, type Season, type WaterNeed } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/crops/")({
  head: () => ({
    meta: [
      { title: "Regional Crop Explorer | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Explore verified crops for Harohalli, Kanakapura and Southern Bengaluru, Karnataka." },
    ],
  }),
  component: CropExplorer,
});

export function CropExplorer() {
  const { lang, t } = useI18n();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [water, setWater] = useState<string>("");

  const filteredCrops = CROPS.filter((c) => {
    const searchTarget = `${c.name} ${c.kannada} ${c.type}`.toLowerCase();
    const matchesQuery = !q || searchTarget.includes(q.toLowerCase().trim());
    const matchesType = !type || c.type === type;
    const matchesSeason = !season || c.seasons.includes(season as Season) || c.seasons.includes("Perennial");
    const matchesWater = !water || c.water === water;
    return matchesQuery && matchesType && matchesSeason && matchesWater;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={t.explorer.title}
        subtitle={t.explorer.subtitle}
        icon={<BookOpen />}
      >
        <DemoBadge label={lang === "kn" ? "ವಲಯ 5 ದಾಖಲೆಗಳು" : "Zone 5 Records"} />
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="relative sm:col-span-4 lg:col-span-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              aria-label="Search crops"
              placeholder={t.explorer.searchPlaceholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`${inputCls} pl-9 text-sm`}
            />
          </div>

          <select
            aria-label="Crop Category"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${inputCls} text-sm`}
          >
            <option value="">{t.explorer.allTypes}</option>
            {["Cereal", "Pulse", "Oilseed", "Horticultural", "Vegetable", "Fruit"].map((cat) => (
              <option key={cat} value={cat}>
                {cat} {lang === "kn" ? `(${cat === "Cereal" ? "ಧಾನ್ಯ" : cat === "Pulse" ? "ದ್ವಿದಳ" : cat === "Oilseed" ? "ಎಣ್ಣೆಕಾಳು" : cat === "Horticultural" ? "ತೋಟಗಾರಿಕೆ" : cat === "Vegetable" ? "ತರಕಾರಿ" : "ಹಣ್ಣು"})` : ""}
              </option>
            ))}
          </select>

          <select
            aria-label="Season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className={`${inputCls} text-sm`}
          >
            <option value="">{t.explorer.allSeasons}</option>
            <option value="Kharif">{lang === "kn" ? "ಮುಂಗಾರು (Kharif: ಜೂನ್–ಅಕ್ಟೋಬರ್)" : "Kharif (Monsoon: Jun–Oct)"}</option>
            <option value="Rabi">{lang === "kn" ? "ಹಿಂಗಾರು (Rabi: ಅಕ್ಟೋಬರ್–ಫೆಬ್ರವರಿ)" : "Rabi (Winter: Oct–Feb)"}</option>
            <option value="Summer">{lang === "kn" ? "ಬೇಸಿಗೆ (Summer: ಫೆಬ್ರವರಿ–ಮೇ)" : "Summer (Feb–May)"}</option>
            <option value="Perennial">{lang === "kn" ? "ವರ್ಷವಿಡೀ / ತೋಟ (Perennial)" : "Perennial (Year-round)"}</option>
          </select>

          <select
            aria-label="Water Need"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className={`${inputCls} text-sm`}
          >
            <option value="">{t.explorer.allWater}</option>
            <option value="Low">{lang === "kn" ? "ಕಡಿಮೆ ನೀರು (ಮಳೆಯಾಶ್ರಿತ)" : "Low Water (Rainfed)"}</option>
            <option value="Moderate">{lang === "kn" ? "ಸಾಧಾರಣ ನೀರು" : "Moderate Water"}</option>
            <option value="High">{lang === "kn" ? "ಹೆಚ್ಚು ನೀರು (ಖಚಿತ ನೀರಾವರಿ)" : "High Water (Assured Irrigation)"}</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 px-1">
          <span>
            {lang === "kn"
              ? `ಒಟ್ಟು ${filteredCrops.length} ಪ್ರಾದೇಶಿಕ ಬೆಳೆಗಳು ಲಭ್ಯ`
              : `Showing ${filteredCrops.length} verified regional crops`}
          </span>
          <span className="text-primary font-medium">
            {lang === "kn" ? "ಹಾರೋಹಳ್ಳಿ • ಕನಕಪುರ • ರಾಮನಗರ" : "Harohalli • Kanakapura • Ramanagara"}
          </span>
        </div>
      </div>

      {filteredCrops.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card">
          <p className="text-sm text-muted-foreground">{t.explorer.noMatch}</p>
        </div>
      )}

      {/* Grid of Regional Crops */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCrops.map((c) => (
          <Link
            key={c.id}
            to="/crops/$id"
            params={{ id: c.id }}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary transition group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CropArt emoji={c.emoji} size="md" />
                  <div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                      {c.name}
                    </h2>
                    <p className="text-xs font-semibold text-primary">
                      {c.kannada}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                <CheckCircle className="h-3 w-3 text-primary" />
                <span>{lang === "kn" ? "ದೃಢೀಕೃತ ಸ್ಥಳೀಯ ಬೆಳೆ" : "Verified Regional Crop"}</span>
              </div>

              <p className="mt-2 text-xs text-foreground/80 leading-relaxed line-clamp-3">
                {lang === "kn" ? c.descriptionKn : c.description}
              </p>

              {/* Key tags: Season, Water, Duration */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {c.seasons.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-muted px-2 py-0.5 font-semibold text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
                  <Droplets className="h-3 w-3 text-sky" />
                  {c.water}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {c.durationDays[0]}–{c.durationDays[1]} {t.common.days}
                </span>
              </div>

              {/* Regional Rationale snippet */}
              <div className="mt-3 rounded-lg bg-secondary/40 p-2.5 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {lang === "kn" ? "ಪ್ರಾದೇಶಿಕ ಮಹತ್ವ: " : "Local Context: "}
                </span>
                {lang === "kn" ? c.regionalRationaleKn : c.regionalRationale}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
              <span>{t.explorer.viewDetails}</span>
              <span className="group-hover:translate-x-1 transition">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
