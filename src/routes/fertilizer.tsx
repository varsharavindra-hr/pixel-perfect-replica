import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/fertilizer")({
  head: () => ({
    meta: [
      { title: "Fertilizer Guidance | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Balanced fertilizer and bio-manure recommendations for Southern Bengaluru soils." },
    ],
  }),
  component: FertPage,
});

export function fertilizerPlan(nKgHa: number, pKgHa: number, kKgHa: number, acres: number) {
  const ha = acres * 0.4047;
  const dap = (pKgHa / 0.46) * ha;
  const urea = Math.max(0, (nKgHa - (dap / ha) * 0.18) / 0.46) * ha;
  const mop = (kKgHa / 0.6) * ha;
  return { urea: Math.round(urea), dap: Math.round(dap), mop: Math.round(mop) };
}

function FertPage() {
  const { lang, t } = useI18n();
  const [cropId, setCropId] = useState("ragi");
  const [acres, setAcres] = useState("2");

  const crop = CROPS.find((x) => x.id === cropId) ?? CROPS[0]!;
  const mid = (r: [number, number]) => (r[0] + r[1]) / 2;
  const acreVal = Number(acres) > 0 ? Number(acres) : 0;
  const plan = fertilizerPlan(mid(crop.npk.n), mid(crop.npk.p), mid(crop.npk.k), acreVal);

  const fertilizerItems = [
    {
      name: lang === "kn" ? "ಯೂರಿಯಾ (Urea - 46% N)" : "Urea (46% N)",
      kg: plan.urea,
      bag: 45,
      when: lang === "kn" ? "ವಿಭಜಿಸಿ: ಅರ್ಧ ಬಿತ್ತನೆಗೆ, ಉಳಿದ ಅರ್ಧ 25–30 ದಿನಗಳಲ್ಲಿ ತೇವಾಂಶವಿದ್ದಾಗ" : "Split: ½ basal at sowing, ½ top-dress at 25–30 days with soil moisture",
    },
    {
      name: lang === "kn" ? "ಡಿ.ಎ.ಪಿ (DAP - 18:46:0)" : "DAP (18% N, 46% P)",
      kg: plan.dap,
      bag: 50,
      when: lang === "kn" ? "ಸಂಪೂರ್ಣ ಪ್ರಮಾಣವನ್ನು ಬಿತ್ತನೆ ಸಾಲಿನಲ್ಲಿ ಬೀಜದ ಪಕ್ಕದಲ್ಲಿ ಇಡಿ" : "Full dose placed near seed row during sowing/transplanting",
    },
    {
      name: lang === "kn" ? "ಎಂ.ಒ.ಪಿ / ಪೊಟ್ಯಾಶ್ (MOP - 60% K)" : "MOP / Potash (60% K)",
      kg: plan.mop,
      bag: 50,
      when: lang === "kn" ? "ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ ತಳ ಗೊಬ್ಬರವಾಗಿ ಪೂರ್ಣ ಪ್ರಮಾಣ ನೀಡಿ" : "Full basal dose at planting for disease resistance and grain shine",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.fertilizer}
        subtitle={
          lang === "kn"
            ? "ಕೆಂಪು ಮಣ್ಣಿನ ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ"
            : "Balanced fertilizer and organic manure planning for regional crops"
        }
        icon={<Leaf />}
      >
        <DemoBadge label={lang === "kn" ? "ಪೋಷಕಾಂಶ ಶಿಫಾರಸು" : "Agronomic Guidelines"} />
      </PageHeader>

      <Panel title={lang === "kn" ? "ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣದ ಲೆಕ್ಕಾಚಾರ" : "Commercial Fertilizer Calculator"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              {lang === "kn" ? "ಬೆಳೆ" : "Crop"}
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
              {lang === "kn" ? "ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)" : "Area (Acres)"}
            </label>
            <input
              inputMode="decimal"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-foreground/80">
          {lang === "kn" ? (
            <>
              <b>{crop.name} ({crop.kannada})</b> ಬೆಳೆಗೆ ಬೆಂಗಳೂರು ಕೃಷಿ ವಿವಿ (GKVK) ಶಿಫಾರಸು ಮಾಡಿದ ಗುರಿ:{" "}
              <b>
                {mid(crop.npk.n)} N : {mid(crop.npk.p)} P : {mid(crop.npk.k)} K kg/ha
              </b>.
            </>
          ) : (
            <>
              Target N-P-K recommendation from UAS Bengaluru for <b>{crop.name}</b>:{" "}
              <b>
                {mid(crop.npk.n)} : {mid(crop.npk.p)} : {mid(crop.npk.k)} kg/ha
              </b>.
            </>
          )}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {fertilizerItems.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs"
            >
              <div className="font-bold text-sm text-foreground">{item.name}</div>
              <div className="text-2xl font-black text-primary">{item.kg} kg</div>
              <div className="text-xs font-semibold text-muted-foreground">
                ≈ {(item.kg / item.bag).toFixed(1)} {lang === "kn" ? "ಚೀಲಗಳು (Bags)" : "bags"}
              </div>
              <div className="text-[11px] text-foreground/80 pt-1 leading-snug">{item.when}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={lang === "kn" ? "ಸಾವಯವ ಹಾಗೂ ಜೈವಿಕ ಗೊಬ್ಬರಗಳು" : "Organic & Bio-fertilizer Options"}>
        <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
          <div className="rounded-xl bg-secondary/60 p-3.5 space-y-1">
            <span className="font-bold text-foreground">
              {lang === "kn" ? "🐄 ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ (FYM):" : "🐄 Well-rotted FYM:"}
            </span>
            <p className="text-muted-foreground">
              {lang === "kn"
                ? "ಬಿತ್ತನೆಗೆ 2-3 ವಾರಗಳ ಮುನ್ನ ಎಕರೆಗೆ 5-6 ಟನ್ ಮಣ್ಣಿಗೆ ಬೆರೆಸಿ ಉಳುಮೆ ಮಾಡಿ."
                : "Apply 5–6 tonnes per acre 2–3 weeks before sowing to improve red soil structure."}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/60 p-3.5 space-y-1">
            <span className="font-bold text-foreground">
              {lang === "kn" ? "🪱 ಎರೆಹುಳು ಗೊಬ್ಬರ (Vermicompost):" : "🪱 Vermicompost:"}
            </span>
            <p className="text-muted-foreground">
              {lang === "kn"
                ? "ರೇಷ್ಮೆ (ಹಿಪ್ಪುನೇರಳೆ) ಮತ್ತು ತರಕಾರಿಗಳಿಗೆ ಎಕರೆಗೆ 1-2 ಟನ್ ನೀಡುವುದರಿಂದ ಲಘು ಪೋಷಕಾಂಶಗಳು ದೊರೆಯುತ್ತವೆ."
                : "1–2 tonnes/acre for vegetables and mulberry provides micronutrients and beneficial microbes."}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/60 p-3.5 space-y-1">
            <span className="font-bold text-foreground">
              {lang === "kn" ? "🌱 ಜೈವಿಕ ಗೊಬ್ಬರ ಬೀಜೋಪಚಾರ:" : "🌱 Bio-fertilizer Seed Inoculation:"}
            </span>
            <p className="text-muted-foreground">
              {lang === "kn"
                ? "ತೊಗರಿ/ಅಲಸಂದೆಗೆ 'ರೈಜೋಬಿಯಂ' ಮತ್ತು ರಾಗಿಗೆ 'ಅಜೋಸ್ಪಿರಿಲಮ್' ಜೈವಿಕ ಗೊಬ್ಬರದಿಂದ ಉಪಚರಿಸಿ (ಎಕರೆಗೆ 200 ಗ್ರಾಂ)."
                : "Treat pulse seeds with Rhizobium and millet seeds with Azospirillum @ 200g/acre."}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/60 p-3.5 space-y-1">
            <span className="font-bold text-foreground">
              {lang === "kn" ? "🧪 ಟ್ರೈಕೋಡರ್ಮ ಶಿಲೀಂಧ್ರನಾಶಕ:" : "🧪 Trichoderma Biocontrol:"}
            </span>
            <p className="text-muted-foreground">
              {lang === "kn"
                ? "ಬೇರು ಕೊಳೆ ಮತ್ತು ಸೊರಗು ರೋಗ ತಡೆಯಲು ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದೊಂದಿಗೆ ಟ್ರೈಕೋಡರ್ಮ ಬೆರೆಸಿ ಹಾಕಿ."
                : "Mix with farmyard manure to suppress soil-borne wilt and root rot naturally."}
            </p>
          </div>
        </div>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಗಮನಿಸಿ: ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ನಲ್ಲಿ ರಂಜಕ ಅಥವಾ ಪೊಟ್ಯಾಶ್ ಹೆಚ್ಚಿದ್ದರೆ, ಮೇಲಿನ ರಸಗೊಬ್ಬರದ ಪ್ರಮಾಣವನ್ನು 25% ಕಡಿಮೆ ಮಾಡಬಹುದು."
            : "Notice: If your Soil Health Card shows high Phosphorus or Potassium levels, adjust commercial application downward by 20–25%."}
        </p>
      </Notice>
    </div>
  );
}
