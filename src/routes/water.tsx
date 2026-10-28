import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets } from "lucide-react";
import { PageHeader, Panel, Notice, inputCls, DemoBadge } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/water")({
  head: () => ({
    meta: [
      { title: "Water & Irrigation Management | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Water budgeting and drip irrigation efficiency for Southern Bengaluru and Ramanagara crops." },
    ],
  }),
  component: WaterPage,
});

const NEED: Record<"Low" | "Moderate" | "High", number> = { Low: 350, Moderate: 550, High: 1100 };

export function waterLitres(mm: number, acres: number, efficiency: number) {
  return Math.round((mm * acres * 4046.86) / efficiency);
}

function WaterPage() {
  const { lang, t } = useI18n();
  const [cropId, setCropId] = useState("ragi");
  const [acres, setAcres] = useState("2");

  const crop = CROPS.find((x) => x.id === cropId) ?? CROPS[0]!;
  const acreVal = Number(acres) > 0 ? Number(acres) : 0;
  const mm = NEED[crop.water];

  const methods = [
    {
      name: lang === "kn" ? "ಹರಿ ನೀರಾವರಿ (Flood / Furrow)" : "Flood / Furrow",
      eff: 0.5,
      note: lang === "kn" ? "ಕಡಿಮೆ ಬಂಡವಾಳ, ಆದರೆ 50% ನೀರು ಆವಿಯಾಗಿ ನಷ್ಟವಾಗುತ್ತದೆ." : "Traditional furrow; significant water loss through evaporation and percolation in red sandy soils.",
    },
    {
      name: lang === "kn" ? "ತುಂತುರು ನೀರಾವರಿ (Sprinkler)" : "Sprinkler Irrigation",
      eff: 0.75,
      note: lang === "kn" ? "ರಾಗಿ, ಶೇಂಗಾ, ದ್ವಿದಳ ಧಾನ್ಯಗಳಿಗೆ ಸೂಕ್ತ. 25-30% ನೀರು ಉಳಿತಾಯ." : "Well suited for groundnut, pulses, and ragi nurseries.",
    },
    {
      name: lang === "kn" ? "ಹನಿ ನೀರಾವರಿ (Drip Irrigation)" : "Drip Irrigation",
      eff: 0.9,
      note: lang === "kn" ? "ಹಿಪ್ಪುನೇರಳೆ, ತರಕಾರಿ ಮತ್ತು ಹಣ್ಣಿನ ತೋಟಗಳಿಗೆ ಅತ್ಯುತ್ತಮ. PMKSY ಸಬ್ಸಿಡಿ ಲಭ್ಯ." : "Ideal for mulberry, tomato, banana and mango. 90% water efficient with PMKSY government subsidy.",
    },
  ];

  const tips = lang === "kn"
    ? [
        "ಬಿಸಿಲಿನ ತಾಪ ಕಡಿಮೆಯಿರುವ ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ನೀರು ಹಾಯಿಸುವುದರಿಂದ ಆವಿಯಾಗುವಿಕೆ ತಡೆಯಬಹುದು.",
        "ಬುಡದಲ್ಲಿ ಒಣ ಸೊಪ್ಪು ಅಥವಾ ಸಾವಯವ ಕಳೆ ಹೊದಿಕೆ (ಮಲ್ಚಿಂಗ್) ಮಾಡುವುದರಿಂದ ತೇವಾಂಶ 1 ವಾರ ಹೆಚ್ಚು ಕಾಲ ಉಳಿಯುತ್ತದೆ.",
        "ಜಮೀನಿನಲ್ಲಿ ನೀರು ಸಮನಾಗಿ ಹರಡಲು ಮೈಕ್ರೋ-ಲೆವೆಲಿಂಗ್ ಮಾಡಿ.",
        "ಹೂವಾಡುವ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಸೂಕ್ಷ್ಮ ಹಂತಗಳಲ್ಲಿ ತಪ್ಪದೇ ನೀರು ಒದಗಿಸಿ.",
        "'ಕೃಷಿ ಭಾಗ್ಯ' ಯೋಜನೆಯಡಿ ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಿಸಿ ಮುಂಗಾರು ಮಳೆಯ ನೀರನ್ನು ಸಂಗ್ರಹಿಸಿ.",
        "ನೀರು ಹಾಯಿಸುವ ಮುನ್ನ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವಿದೆಯೇ ಎಂದು ಕೈಯಿಂದ ಪರೀಕ್ಷಿಸಿ (ಓವರ್-ಇರಿಗೇಷನ್ ಬೇಡ).",
      ]
    : [
        "Irrigate in the early morning or evening to drastically reduce surface evaporation in dry spells.",
        "Mulch around crop root-zones with crop residue or coir pith to retain soil moisture.",
        "Level undulating red soil fields to ensure uniform water spread without erosion.",
        "Prioritize irrigation at critical crop stages: flowering, fruit setting, and grain filling.",
        "Construct a 'Krishi Honda' (farm pond) under Karnataka's Krishi Bhagya scheme to store rainfall.",
        "Check soil moisture by hand feel before running borewell pumps to avoid over-irrigation.",
      ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.water}
        subtitle={
          lang === "kn"
            ? "ಬೆಳೆಗೆ ಅಗತ್ಯವಿರುವ ನೀರಿನ ಅಂದಾಜು ಮತ್ತು ಹನಿ ನೀರಾವರಿಯ ಉಳಿತಾಯ ಲೆಕ್ಕಾಚಾರ"
            : "Estimate crop water requirement and compare irrigation efficiencies"
        }
        icon={<Droplets />}
      >
        <DemoBadge label={lang === "kn" ? "ನೀರಿನ ಲೆಕ್ಕಾಚಾರ" : "Water Budget Tool"} />
      </PageHeader>

      <Panel title={lang === "kn" ? "ನೀರಿನ ಅವಶ್ಯಕತೆಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್" : "Crop Water Calculator"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              {lang === "kn" ? "ಬೆಳೆ ಆಯ್ಕೆ" : "Select Crop"}
            </label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className={inputCls}
            >
              {CROPS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name} ({x.kannada})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              {lang === "kn" ? "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)" : "Farm Area (Acres)"}
            </label>
            <input
              inputMode="decimal"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className={inputCls}
            />
            {!(Number(acres) > 0) && (
              <span className="text-xs text-destructive">
                {lang === "kn" ? "ಸೊನ್ನೆಗಿಂತ ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ." : "Enter a valid positive number."}
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-foreground/80 leading-relaxed">
          {lang === "kn" ? (
            <>
              <b>{crop.name} ({crop.kannada})</b> ಬೆಳೆಗೆ ಒಂದು ಹಂಗಾಮಿನಲ್ಲಿ ಸರಿಸುಮಾರು{" "}
              <b className="text-primary font-bold">{mm} ಮಿ.ಮೀ</b> ನೀರು ಬೇಕಾಗುತ್ತದೆ ({crop.water} ಪ್ರಮಾಣ). ಮುಂಗಾರು ಮಳೆಯು ಈ ನೀರಾವರಿ ಅಗತ್ಯವನ್ನು ಭಾಗಶಃ ಪೂರೈಸುತ್ತದೆ.
            </>
          ) : (
            <>
              <b>{crop.name}</b> requires approximately{" "}
              <b className="text-primary font-bold">{mm} mm</b> of moisture per season ({crop.water.toLowerCase()} requirement). Monsoon rainfall offsets the required pump irrigation volume.
            </>
          )}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs"
            >
              <div className="font-bold text-sm text-foreground">{m.name}</div>
              <div className="text-2xl font-black text-primary">
                {(waterLitres(mm, acreVal, m.eff) / 100000).toFixed(1)}{" "}
                <span className="text-sm font-semibold">{lang === "kn" ? "ಲಕ್ಷ ಲೀಟರ್" : "lakh L"}</span>
              </div>
              <div className="text-[11px] text-muted-foreground pt-1">
                {Math.round(m.eff * 100)}% {lang === "kn" ? "ದಕ್ಷತೆ" : "efficiency"} • {m.note}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={lang === "kn" ? "ನೀರು ಉಳಿಸುವ ಪ್ರಮುಖ ತಂತ್ರಗಳು" : "Water Conservation Strategies"}>
        <ul className="grid gap-2.5 text-xs sm:text-sm sm:grid-cols-2">
          {tips.map((t, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-secondary-foreground"
            >
              <Droplets className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಹಾರೋಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರದಲ್ಲಿ ಬೋರ್‌ವೆಲ್‌ಗಳ ಆಳ ಹೆಚ್ಚಿರುವುದರಿಂದ ಹನಿ ನೀರಾವರಿ ಅಳವಡಿಸುವುದು ಅತ್ಯಂತ ಸೂಕ್ತ. ಸಬ್ಸಿಡಿಗಾಗಿ ತಾಲೂಕು ತೋಟಗಾರಿಕಾ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."
            : "Given deep groundwater tables in granite bedrock across Kanakapura and Harohalli, drip fertigation maximizes yield per drop. Apply for PMKSY drip subsidy via the Taluk Horticulture Department."}
        </p>
      </Notice>
    </div>
  );
}
