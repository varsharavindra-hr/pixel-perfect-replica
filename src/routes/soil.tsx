import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, HelpCircle, FileText } from "lucide-react";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/soil")({
  head: () => ({
    meta: [
      { title: "Soil Health Analysis | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Understand your red soil nutrient levels from your Karnataka Soil Health Card." },
    ],
  }),
  component: SoilPage,
});

// Nutrient ratings for Red soils of Karnataka (Zone 5) in kg/ha
const SOIL_STANDARDS: Record<"n" | "p" | "k", [number, number]> = {
  n: [250, 450], // Available Nitrogen
  p: [10, 25],   // Available Phosphorus
  k: [110, 280], // Available Potassium
};

function getNutrientRating(val: number, [low, high]: [number, number], lang: "kn" | "en") {
  if (val < low) return lang === "kn" ? "ಕಡಿಮೆ (Low)" : "Low";
  if (val > high) return lang === "kn" ? "ಹೆಚ್ಚು (High)" : "High";
  return lang === "kn" ? "ಮಧ್ಯಮ (Medium)" : "Medium";
}

function getPhRating(ph: number, lang: "kn" | "en") {
  if (ph < 5.5) return lang === "kn" ? "ತೀವ್ರ ಆಮ್ಲೀಯ (Strongly Acidic)" : "Strongly Acidic";
  if (ph < 6.5) return lang === "kn" ? "ಸ್ವಲ್ಪ ಆಮ್ಲೀಯ (Slightly Acidic - ಕೆಂಪು ಮಣ್ಣಿನ ಸಹಜ ಸ್ಥಿತಿ)" : "Slightly Acidic (Typical Red Soil)";
  if (ph <= 7.5) return lang === "kn" ? "ತಟಸ್ಥ (Neutral - ಸೂಕ್ತ)" : "Neutral (Ideal)";
  return lang === "kn" ? "ಕ್ಷಾರೀಯ (Alkaline)" : "Alkaline";
}

function SoilPage() {
  const { lang, t } = useI18n();
  const [form, setForm] = useState({
    cardNo: "KA-RAM-2026-0814",
    testDate: "2026-04-12",
    n: "230",
    p: "18",
    k: "180",
    ph: "6.4",
    oc: "0.52",
    ec: "0.35",
  });

  const num = (k: keyof typeof form) => {
    const parsed = Number(form[k]);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const nutrientCards = [
    {
      label: lang === "kn" ? "ಸಾರಜನಕ (Nitrogen - N)" : "Available Nitrogen (N)",
      val: `${form.n} kg/ha`,
      rating: getNutrientRating(num("n"), SOIL_STANDARDS.n, lang),
      tip: lang === "kn" ? "ಎಲೆಗಳು ಮತ್ತು ಕಾಂಡದ ಹಸಿರು ಬೆಳವಣಿಗೆಗೆ ಸಹಕಾರಿ." : "Promotes vegetative and leaf canopy growth.",
    },
    {
      label: lang === "kn" ? "ರಂಜಕ (Phosphorus - P)" : "Available Phosphorus (P)",
      val: `${form.p} kg/ha`,
      rating: getNutrientRating(num("p"), SOIL_STANDARDS.p, lang),
      tip: lang === "kn" ? "ಆಳವಾದ ಬೇರು ಬೆಳವಣಿಗೆ ಮತ್ತು ಕಾಯಿ ಕಟ್ಟಲು ಅವಶ್ಯಕ." : "Essential for root branching, flowering, and seed set.",
    },
    {
      label: lang === "kn" ? "ಪೊಟ್ಯಾಶ್ (Potassium - K)" : "Available Potassium (K)",
      val: `${form.k} kg/ha`,
      rating: getNutrientRating(num("k"), SOIL_STANDARDS.k, lang),
      tip: lang === "kn" ? "ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಮತ್ತು ಕಾಳಿನ ಗುಣಮಟ್ಟ ಹೆಚ್ಚಿಸುತ್ತದೆ." : "Improves drought resilience, grain weight and disease defense.",
    },
    {
      label: lang === "kn" ? "ಮಣ್ಣಿನ ಪಿ.ಎಚ್ (Soil pH)" : "Soil pH",
      val: form.ph,
      rating: getPhRating(num("ph"), lang),
      tip: lang === "kn" ? "ಪೋಷಕಾಂಶಗಳನ್ನು ಗಿಡ ಹೀರಿಕೊಳ್ಳಲು ನಿರ್ಣಾಯಕ ಪಾತ್ರ ವಹಿಸುತ್ತದೆ." : "Governs nutrient solubility and uptake by plant roots.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.soil}
        subtitle={
          lang === "kn"
            ? "ನಿಮ್ಮ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಸರಳ ಸಾರಾಂಶ ಪಡೆಯಿರಿ"
            : "Review Soil Health Card nutrient ratings for Southern Bengaluru soils"
        }
        icon={<FlaskConical />}
      >
        <DemoBadge label={lang === "kn" ? "ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ" : "Soil Evaluation"} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input Form Panel */}
        <Panel
          title={lang === "kn" ? "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ವಿವರ" : "Soil Health Card Entry"}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {lang === "kn" ? "ಕಾರ್ಡ್ ಸಂಖ್ಯೆ" : "Soil Health Card No."}
              </label>
              <input
                value={form.cardNo}
                onChange={(e) => setForm({ ...form, cardNo: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {lang === "kn" ? "ಪರೀಕ್ಷಿಸಿದ ದಿನಾಂಕ" : "Soil Sample Test Date"}
              </label>
              <input
                type="date"
                value={form.testDate}
                onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  N (kg/ha)
                </label>
                <input
                  inputMode="decimal"
                  value={form.n}
                  onChange={(e) => setForm({ ...form, n: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  P (kg/ha)
                </label>
                <input
                  inputMode="decimal"
                  value={form.p}
                  onChange={(e) => setForm({ ...form, p: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  K (kg/ha)
                </label>
                <input
                  inputMode="decimal"
                  value={form.k}
                  onChange={(e) => setForm({ ...form, k: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  pH
                </label>
                <input
                  inputMode="decimal"
                  value={form.ph}
                  onChange={(e) => setForm({ ...form, ph: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  {lang === "kn" ? "ಸಾವಯವ ಇಂಗಾಲ (%)" : "Organic Carbon (%)"}
                </label>
                <input
                  inputMode="decimal"
                  value={form.oc}
                  onChange={(e) => setForm({ ...form, oc: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-foreground">
                  EC (dS/m)
                </label>
                <input
                  inputMode="decimal"
                  value={form.ec}
                  onChange={(e) => setForm({ ...form, ec: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* Evaluation Output Panel */}
        <div className="space-y-4 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3">
            {nutrientCards.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1"
              >
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="text-xl font-extrabold text-foreground">{c.val}</div>
                <div className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                  {c.rating}
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">{c.tip}</p>
              </div>
            ))}
          </div>

          <Panel title={lang === "kn" ? "ರಾಮನಗರ ಕೆಂಪು ಮಣ್ಣಿನ ಶಿಫಾರಸು" : "Ramanagara Red Soil Recommendations"}>
            <div className="space-y-2 text-xs sm:text-sm text-foreground/90">
              <p>
                <b>{lang === "kn" ? "1. ಸಾರಜನಕ ನಿರ್ವಹಣೆ:" : "1. Nitrogen Management:"}</b>{" "}
                {lang === "kn"
                  ? "ಕೆಂಪು ಮರಳು ಮಣ್ಣಿನಲ್ಲಿ ಸಾರಜನಕವು ನೀರಿಗೆ ಬೇಗನೆ ಕೊಚ್ಚಿ ಹೋಗುವುದರಿಂದ ಯೂರಿಯಾವನ್ನು ಒಂದೇ ಬಾರಿಗೆ ಹಾಕದೆ 2-3 ಹಂತಗಳಲ್ಲಿ ವಿಭಜಿಸಿ ಕೊಡಿ."
                  : "Due to coarse sandy texture, split urea into 2–3 split doses rather than applying in a single bulk dose."}
              </p>
              <p>
                <b>{lang === "kn" ? "2. ಸಾವಯವ ಗೊಬ್ಬರ:" : "2. Organic Manuring:"}</b>{" "}
                {lang === "kn"
                  ? "ಎಕರೆಗೆ 5 ರಿಂದ 6 ಟನ್ ಕಾಂಪೋಸ್ಟ್ ಅಥವಾ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಸೇರಿಸುವುದರಿಂದ ಕೆಂಪು ಮಣ್ಣಿನ ತೇವಾಂಶ ಉಳಿಸಿಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚುತ್ತದೆ."
                  : "Apply 5–6 tonnes FYM/compost per acre to bolster water retention capacity of light red soils."}
              </p>
              <p>
                <b>{lang === "kn" ? "3. ಸುಣ್ಣದ ಬಳಕೆ (ಪಿ.ಎಚ್ 5.5 ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದ್ದರೆ):" : "3. Liming for Acidic Soils:"}</b>{" "}
                {lang === "kn"
                  ? "ಮಣ್ಣು ಅತಿಯಾಗಿ ಆಮ್ಲೀಯವಾಗಿದ್ದರೆ (pH < 5.5), ಪ್ರತಿ 3 ವರ್ಷಕ್ಕೊಮ್ಮೆ ಎಕರೆಗೆ 200 ಕೆಜಿ ಕೃಷಿ ಸುಣ್ಣ ಅಥವಾ ಡಾಲೋಮೈಟ್ ಬಳಸಿ."
                  : "If soil pH drops below 5.5, apply agricultural lime or dolomite @ 200 kg/acre every 3 years."}
              </p>
            </div>
          </Panel>
        </div>
      </div>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಮಣ್ಣು ಪರೀಕ್ಷೆಗಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (ಹಾರೋಹಳ್ಳಿ / ಕನಕಪುರ) ಅಥವಾ ಚಂದೂರಾಯನಹಳ್ಳಿಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ವನ್ನು ಸಂಪರ್ಕಿಸಿ."
            : "For official soil testing, contact your nearest Raitha Samparka Kendra (Harohalli / Kanakapura) or ICAR-KVK Chandurayanahalli, Ramanagara."}
        </p>
      </Notice>
    </div>
  );
}
