import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudSun, CloudRain, Sun, Cloud, MapPin, Calendar } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, DemoBadge, Notice } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather & Agro-Calendar | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Agro-climatic forecast and season-wise sowing calendar for Harohalli and Kanakapura." },
    ],
  }),
  component: WeatherPage,
});

// Sample 7-day forecast calibrated for Kanakapura / Harohalli (Zone 5)
const FORECAST = [
  { d: "Thu", dKn: "ಗುರು", hi: 32, lo: 21, rain: 5, icon: Sun },
  { d: "Fri", dKn: "ಶುಕ್ರ", hi: 31, lo: 22, rain: 15, icon: CloudSun },
  { d: "Sat", dKn: "ಶನಿ", hi: 29, lo: 21, rain: 45, icon: CloudRain },
  { d: "Sun", dKn: "ಭಾನು", hi: 28, lo: 20, rain: 60, icon: CloudRain },
  { d: "Mon", dKn: "ಸೋಮ", hi: 30, lo: 20, rain: 20, icon: Cloud },
  { d: "Tue", dKn: "ಮಂಗಳ", hi: 31, lo: 21, rain: 10, icon: CloudSun },
  { d: "Wed", dKn: "ಬುಧ", hi: 32, lo: 22, rain: 0, icon: Sun },
];

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_KN = ["ಜನ", "ಫೆಬ್ರ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗ", "ಸೆಪ್ಟೆಂ", "ಅಕ್ಟೋ", "ನವೆಂ", "ಡಿಸೆಂ"];

// Verified regional sowing and harvest calendar for Southern Bengaluru / Ramanagara
const REGIONAL_CAL: Record<string, { crop: string; cropKn: string; sow: number[]; harvest: number[] }[]> = {
  Kharif: [
    { crop: "Ragi (ರಾಗಿ)", cropKn: "ರಾಗಿ", sow: [6, 7], harvest: [10, 11] },
    { crop: "Red Gram (ತೊಗರಿ)", cropKn: "ತೊಗರಿ", sow: [5, 6], harvest: [11, 0] },
    { crop: "Maize (ಮುಸುಕಿನ ಜೋಳ)", cropKn: "ಮುಸುಕಿನ ಜೋಳ", sow: [5, 6], harvest: [8, 9] },
    { crop: "Groundnut (ಕಡಲೆಕಾಯಿ)", cropKn: "ಕಡಲೆಕಾಯಿ", sow: [5, 6], harvest: [9, 10] },
    { crop: "Tomato (ಟೊಮೇಟೊ)", cropKn: "ಟೊಮೇಟೊ", sow: [5, 6], harvest: [8, 9] },
    { crop: "Cowpea (ಅಲಸಂದೆ)", cropKn: "ಅಲಸಂದೆ", sow: [5, 6], harvest: [7, 8] },
  ],
  Rabi: [
    { crop: "Horse Gram (ಹುರುಳಿ)", cropKn: "ಹುರುಳಿ", sow: [7, 8], harvest: [10, 11] },
    { crop: "Rabi Maize (ಹಿಂಗಾರು ಜೋಳ)", cropKn: "ಹಿಂಗಾರು ಜೋಳ", sow: [9, 10], harvest: [1, 2] },
    { crop: "Tomato (ಚಳಿಗಾಲದ ಟೊಮೇಟೊ)", cropKn: "ಟೊಮೇಟೊ", sow: [9, 10], harvest: [0, 1] },
    { crop: "Brinjal (ಬದನೆಕಾಯಿ)", cropKn: "ಬದನೆಕಾಯಿ", sow: [8, 9], harvest: [11, 0, 1] },
  ],
  Summer: [
    { crop: "Summer Groundnut (ಬೇಸಿಗೆ ಶೇಂಗಾ)", cropKn: "ಬೇಸಿಗೆ ಶೇಂಗಾ", sow: [0, 1], harvest: [4, 5] },
    { crop: "Summer Cowpea (ಬೇಸಿಗೆ ಅಲಸಂದೆ)", cropKn: "ಬೇಸಿಗೆ ಅಲಸಂದೆ", sow: [1, 2], harvest: [3, 4] },
    { crop: "Papaya (ಪಪ್ಪಾಯಿ)", cropKn: "ಪಪ್ಪಾಯಿ", sow: [1, 2], harvest: [9, 10, 11] },
  ],
  Perennial: [
    { crop: "Mulberry (ಹಿಪ್ಪುನೇರಳೆ)", cropKn: "ಹಿಪ್ಪುನೇರಳೆ", sow: [5, 6], harvest: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { crop: "Mango (ಮಾವು)", cropKn: "ಮಾವು", sow: [6, 7], harvest: [3, 4, 5] },
    { crop: "Coconut (ತೆಂಗು)", cropKn: "ತೆಂಗು", sow: [5, 6, 7], harvest: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { crop: "Sapota (ಸಪೋಟ)", cropKn: "ಸಪೋಟ", sow: [6, 7], harvest: [2, 3, 4, 5] },
  ],
};

function WeatherPage() {
  const { lang, t } = useI18n();
  const [season, setSeason] = useState("Kharif");

  const months = lang === "kn" ? MONTHS_KN : MONTHS_EN;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.weather}
        subtitle={
          lang === "kn"
            ? "ಹಾರೋಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರ ಭಾಗದ ಹವಾಮಾನ ಮತ್ತು ಬಿತ್ತನೆ ಕ್ಯಾಲೆಂಡರ್"
            : "Agro-weather forecast and sowing calendar for Harohalli & Kanakapura"
        }
        icon={<CloudSun />}
      >
        <DemoBadge label={lang === "kn" ? "ಮಾದರಿ ಹವಾಮಾನ ಮಾಹಿತಿ" : "Sample Weather Data"} />
      </PageHeader>

      {/* 7-day forecast */}
      <Panel
        title={
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {lang === "kn"
                ? "7 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ • ಹಾರೋಹಳ್ಳಿ / ಕನಕಪುರ"
                : "7-Day Agro-Weather • Harohalli / Kanakapura"}
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {FORECAST.map(({ d, dKn, hi, lo, rain, icon: Icon }) => (
            <div
              key={d}
              className="rounded-2xl border border-border bg-card p-3 text-center space-y-1 shadow-xs"
            >
              <div className="text-xs font-bold text-foreground">
                {lang === "kn" ? dKn : d}
              </div>
              <Icon className="mx-auto my-1.5 h-6 w-6 text-primary" />
              <div className="text-xs font-bold text-foreground">
                {hi}° <span className="font-normal text-muted-foreground">/ {lo}°</span>
              </div>
              <div className="text-[10px] font-semibold text-sky">
                {rain}% {lang === "kn" ? "ಮಳೆ" : "rain"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={lang === "kn" ? "dKn" : "d"} fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--muted-foreground)" />
              <Tooltip />
              <Area
                dataKey="hi"
                name={lang === "kn" ? "ಗರಿಷ್ಠ ತಾಪಮಾನ (°C)" : "Max °C"}
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.2}
              />
              <Area
                dataKey="rain"
                name={lang === "kn" ? "ಮಳೆಯ ಸಾಧ್ಯತೆ (%)" : "Rain chance %"}
                stroke="var(--color-sky)"
                fill="var(--color-sky)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-xs text-foreground flex items-center gap-2">
          <span>🌧️</span>
          <span>
            {lang === "kn"
              ? "ಕೃಷಿ ಸಲಹೆ: ಶನಿವಾರ-ಭಾನುವಾರ ಸಾಧಾರಣ ಮಳೆಯ ಸಾಧ್ಯತೆ. ಶುಕ್ರವಾರ ಸಂಜೆ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಮಾಡಬೇಡಿ."
              : "Advisory: Rainfall expected over the weekend. Avoid spraying pesticides or chemical foliar fertilizers on Friday evening."}
          </span>
        </div>
      </Panel>

      {/* Sowing and Harvesting Calendar */}
      <Panel
        title={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{lang === "kn" ? "ಋತುಮಾನವಾರು ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್" : "Regional Cropping Calendar"}</span>
          </div>
        }
        action={
          <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs">
            {Object.keys(REGIONAL_CAL).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeason(s)}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  season === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "Kharif"
                  ? (lang === "kn" ? "ಮುಂಗಾರು" : "Kharif")
                  : s === "Rabi"
                  ? (lang === "kn" ? "ಹಿಂಗಾರು" : "Rabi")
                  : s === "Summer"
                  ? (lang === "kn" ? "ಬೇಸಿಗೆ" : "Summer")
                  : (lang === "kn" ? "ವರ್ಷವಿಡೀ" : "Perennial")}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-bold text-foreground w-44">
                  {lang === "kn" ? "ಬೆಳೆ" : "Crop"}
                </th>
                {months.map((m) => (
                  <th key={m} className="p-1 text-center font-semibold text-muted-foreground">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(REGIONAL_CAL[season] ?? []).map((r) => (
                <tr key={r.crop} className="hover:bg-muted/30">
                  <td className="p-2 font-semibold text-foreground">
                    {r.crop}
                  </td>
                  {months.map((_, idx) => {
                    const isSow = r.sow.includes(idx);
                    const isHarvest = r.harvest.includes(idx);
                    return (
                      <td key={idx} className="p-1 text-center">
                        <div
                          className={`h-5 rounded text-[9px] font-bold flex items-center justify-center ${
                            isSow
                              ? "bg-primary text-primary-foreground"
                              : isHarvest
                              ? "bg-warning/80 text-warning-foreground"
                              : "bg-muted/40"
                          }`}
                        >
                          {isSow ? (lang === "kn" ? "ಬಿತ್ತನೆ" : "Sow") : isHarvest ? (lang === "kn" ? "ಕಟಾವು" : "Harv") : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-primary" />
            <span>{lang === "kn" ? "ಬಿತ್ತನೆ / ನಾಟಿ ಹಂತ" : "Sowing / Planting"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-warning/80" />
            <span>{lang === "kn" ? "ಕಟಾವು ಹಂತ" : "Harvesting Period"}</span>
          </div>
        </div>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ನೈಜ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಾಗಿ ಕರ್ನಾಟಕ ರಾಜ್ಯ ನೈಸರ್ಗಿಕ ವಿಕೋಪ ಉಸ್ತುವಾರಿ ಕೇಂದ್ರ (KSNDMC - ವರುಣಮಿತ್ರ: 9243345433) ಸಂಪರ್ಕಿಸಬಹುದು."
            : "For live government weather and radar advisories, consult Karnataka State Natural Disaster Monitoring Centre (KSNDMC - Varunamitra: 9243345433)."}
        </p>
      </Notice>
    </div>
  );
}
