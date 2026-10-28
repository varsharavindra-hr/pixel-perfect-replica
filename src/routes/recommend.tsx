import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sprout,
  Loader2,
  Bookmark,
  Scale,
  Eye,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Notice, CropArt, DemoBadge, inputCls } from "@/components/common";
import {
  REGIONAL_LOCATIONS,
  SOIL_TYPES,
  type Season,
  type WaterNeed,
} from "@/lib/crops";
import {
  recommendRegionalCrops,
  SAMPLE_REGIONAL_INPUT,
  type RecommendationResult,
} from "@/lib/recommend";
import { useSaved, useCompare, useFarmerAuth } from "@/lib/storage";
import { validateRegionalForm, type FormState } from "@/lib/validate";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Region-specific crop recommendations for Harohalli, Kanakapura, Ramanagara & Southern Bengaluru." },
      { property: "og:title", content: "Crop Recommendation – Raitha Bandhu" },
    ],
  }),
  component: RecommendPage,
});

const INITIAL_FORM: FormState = {
  taluk: "Kanakapura",
  village: "",
  soilType: "Red sandy loam",
  season: "Kharif",
  water: "Low",
  irrigation: false,
  area: "",
  areaUnit: "acre",
  n: "",
  p: "",
  k: "",
  ph: "",
  temperature: "",
  humidity: "",
  rainfall: "",
};

export function RecommendPage() {
  const { lang, t } = useI18n();
  const { farmer } = useFarmerAuth();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [detail, setDetail] = useState<RecommendationResult | null>(null);
  const [saved, setSaved] = useSaved();
  const [compare, setCompare] = useCompare();

  // If farmer has saved farm profile, pre-fill location and soil details
  useEffect(() => {
    if (farmer.isLoggedIn) {
      setForm((prev) => ({
        ...prev,
        taluk: farmer.taluk || prev.taluk,
        village: farmer.village || prev.village,
        soilType: farmer.soilType || prev.soilType,
        area: farmer.farmArea || prev.area,
        irrigation: farmer.waterSource === "Borewell" || farmer.waterSource === "Drip Irrigation",
      }));
    }
  }, [farmer]);

  const setField = (k: keyof FormState, v: string | boolean) => {
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "taluk" ? { village: "" } : {}),
    }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleFillSample = () => {
    setForm({
      taluk: SAMPLE_REGIONAL_INPUT.taluk,
      village: SAMPLE_REGIONAL_INPUT.village || "",
      soilType: SAMPLE_REGIONAL_INPUT.soilType || "Red sandy loam",
      season: SAMPLE_REGIONAL_INPUT.season,
      water: SAMPLE_REGIONAL_INPUT.water,
      irrigation: SAMPLE_REGIONAL_INPUT.irrigation,
      area: SAMPLE_REGIONAL_INPUT.area ? String(SAMPLE_REGIONAL_INPUT.area) : "2.5",
      areaUnit: SAMPLE_REGIONAL_INPUT.areaUnit,
      n: "",
      p: "",
      k: "",
      ph: "",
      temperature: "",
      humidity: "",
      rainfall: "",
    });
    setErrors({});
    toast.info(lang === "kn" ? "ಹಾರೋಹಳ್ಳಿ/ಕನಕಪುರ ಮಾದರಿ ವಿವರಗಳನ್ನು ತುಂಬಲಾಗಿದೆ" : "Sample regional values populated");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, data } = validateRegionalForm(form, lang);
    setErrors(errs);

    if (!data) {
      toast.error(lang === "kn" ? "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ವಿವರಗಳನ್ನು ಸರಿಪಡಿಸಿ." : "Please correct highlighted fields.");
      return;
    }

    setLoading(true);
    setResults(null);

    setTimeout(() => {
      const recs = recommendRegionalCrops(data);
      setResults(recs);
      setLoading(false);
      setTimeout(() => {
        document.getElementById("recommendation-results")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }, 600);
  };

  const handleSave = (r: RecommendationResult) => {
    const isAlreadySaved = saved.some((s) => s.cropId === r.crop.id);
    if (isAlreadySaved) {
      toast.info(lang === "kn" ? "ಈ ಬೆಳೆ ಈಗಾಗಲೇ ಉಳಿಸಲಾಗಿದೆ" : `${r.crop.name} is already saved`);
      return;
    }

    setSaved([
      {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        cropId: r.crop.id,
        cropName: r.crop.name,
        cropKannada: r.crop.kannada,
        matchScore: r.matchScore,
        matchLevel: r.matchLevel,
        location: `${form.village ? `${form.village}, ` : ""}${form.taluk}`,
        season: form.season,
      },
      ...saved,
    ]);
    toast.success(lang === "kn" ? `${r.crop.kannada} ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ` : `${r.crop.name} saved to your profile`);
  };

  const toggleCompare = (cropId: string) => {
    setCompare((curr) => {
      if (curr.includes(cropId)) {
        return curr.filter((id) => id !== cropId);
      }
      return [...curr, cropId].slice(-3);
    });
  };

  const selectedTalukData = REGIONAL_LOCATIONS.find((loc) => loc.taluk === form.taluk);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.recommend.title}
        subtitle={t.recommend.subtitle}
        icon={<Sprout />}
      >
        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-primary transition"
        >
          <span>{t.recommend.fillSample}</span>
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Section 1: Location */}
        <Panel
          title={
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{t.recommend.locationSection}</span>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="taluk" className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.talukLabel} <span className="text-destructive">*</span>
              </label>
              <select
                id="taluk"
                value={form.taluk}
                onChange={(e) => setField("taluk", e.target.value)}
                className={`${inputCls} ${errors.taluk ? "border-destructive" : ""}`}
              >
                {REGIONAL_LOCATIONS.map((loc) => (
                  <option key={loc.taluk} value={loc.taluk}>
                    {loc.taluk} ({loc.talukKn})
                  </option>
                ))}
              </select>
              {errors.taluk && <p className="mt-1 text-xs text-destructive">{errors.taluk}</p>}
            </div>

            <div>
              <label htmlFor="village" className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.villageLabel} <span className="text-xs text-muted-foreground font-normal">({t.common.optional})</span>
              </label>
              <select
                id="village"
                value={form.village}
                onChange={(e) => setField("village", e.target.value)}
                className={inputCls}
              >
                <option value="">{lang === "kn" ? "ಗ್ರಾಮ / ಊರು ಆರಿಸಿ" : "Select village / locality"}</option>
                {selectedTalukData?.villages.map((v) => (
                  <option key={v.en} value={v.en}>
                    {v.en} ({v.kn})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Panel>

        {/* Section 2: Growing Conditions & Water */}
        <Panel title={t.recommend.weatherSection}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.seasonLabel} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "Kharif", label: t.recommend.seasonKharif },
                  { id: "Rabi", label: t.recommend.seasonRabi },
                  { id: "Summer", label: t.recommend.seasonSummer },
                  { id: "Perennial", label: t.recommend.seasonPerennial },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setField("season", s.id as Season)}
                    className={`rounded-xl border p-2.5 text-xs font-semibold text-left transition ${
                      form.season === s.id
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "bg-card hover:border-primary text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {errors.season && <p className="mt-1 text-xs text-destructive">{errors.season}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.waterLabel} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Low", label: t.recommend.waterLow },
                  { id: "Moderate", label: t.recommend.waterModerate },
                  { id: "High", label: t.recommend.waterHigh },
                ].map((w) => (
                  <button
                    type="button"
                    key={w.id}
                    onClick={() => setField("water", w.id as WaterNeed)}
                    className={`rounded-xl border p-2 text-xs font-semibold text-center transition ${
                      form.water === w.id
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "bg-card hover:border-primary text-foreground"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
              {errors.water && <p className="mt-1 text-xs text-destructive">{errors.water}</p>}

              {/* Irrigation Checkbox */}
              <label className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary transition">
                <input
                  type="checkbox"
                  checked={form.irrigation}
                  onChange={(e) => setField("irrigation", e.target.checked)}
                  className="h-5 w-5 rounded accent-primary"
                />
                <span className="text-xs font-semibold text-foreground">
                  {t.recommend.irrigationCheckbox}
                </span>
              </label>
            </div>

            {/* Farm Area */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.areaLabel} <span className="text-xs text-muted-foreground font-normal">({t.common.optional})</span>
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={form.area}
                  onChange={(e) => setField("area", e.target.value)}
                  placeholder="2.5"
                  className={inputCls}
                />
                <select
                  value={form.areaUnit}
                  onChange={(e) => setField("areaUnit", e.target.value as "acre" | "hectare")}
                  className={`${inputCls} w-28`}
                >
                  <option value="acre">{lang === "kn" ? "ಎಕರೆ" : "acre"}</option>
                  <option value="hectare">{lang === "kn" ? "ಹೆಕ್ಟೇರ್" : "hectare"}</option>
                </select>
              </div>
              {errors.area && <p className="mt-1 text-xs text-destructive">{errors.area}</p>}
            </div>

            {/* Soil Type */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {t.recommend.soilTypeLabel}
              </label>
              <select
                value={form.soilType}
                onChange={(e) => setField("soilType", e.target.value)}
                className={inputCls}
              >
                <option value="">{lang === "kn" ? "ಗೊತ್ತಿಲ್ಲ (ಸ್ಥಳೀಯ ಕೆಂಪು ಮಣ್ಣಿನ ಸರಾಸರಿ)" : "Don't know (Use regional average)"}</option>
                {SOIL_TYPES.map((s) => (
                  <option key={s.en} value={s.en}>
                    {lang === "kn" ? s.kn : s.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Panel>

        {/* Section 3: Technical Soil Test Values (Optional!) */}
        <Panel
          title={
            <div className="flex items-center justify-between w-full">
              <span>{t.recommend.soilSection}</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {t.common.optional}
              </span>
            </div>
          }
        >
          <div className="rounded-xl bg-secondary/50 p-3 mb-4 text-xs text-secondary-foreground flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p>{t.recommend.optionalNote}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {t.recommend.soilPhLabel}
              </label>
              <input
                inputMode="decimal"
                value={form.ph}
                onChange={(e) => setField("ph", e.target.value)}
                placeholder="6.5"
                className={`${inputCls} text-sm ${errors.ph ? "border-destructive" : ""}`}
              />
              <span className="text-[10px] text-muted-foreground">0–14 (6.5 neutral)</span>
              {errors.ph && <p className="text-[11px] text-destructive">{errors.ph}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {t.recommend.nLabel}
              </label>
              <input
                inputMode="decimal"
                value={form.n}
                onChange={(e) => setField("n", e.target.value)}
                placeholder="kg/ha"
                className={`${inputCls} text-sm ${errors.n ? "border-destructive" : ""}`}
              />
              <span className="text-[10px] text-muted-foreground">kg/ha (0–400)</span>
              {errors.n && <p className="text-[11px] text-destructive">{errors.n}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {t.recommend.pLabel}
              </label>
              <input
                inputMode="decimal"
                value={form.p}
                onChange={(e) => setField("p", e.target.value)}
                placeholder="kg/ha"
                className={`${inputCls} text-sm ${errors.p ? "border-destructive" : ""}`}
              />
              <span className="text-[10px] text-muted-foreground">kg/ha (0–300)</span>
              {errors.p && <p className="text-[11px] text-destructive">{errors.p}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                {t.recommend.kLabel}
              </label>
              <input
                inputMode="decimal"
                value={form.k}
                onChange={(e) => setField("k", e.target.value)}
                placeholder="kg/ha"
                className={`${inputCls} text-sm ${errors.k ? "border-destructive" : ""}`}
              />
              <span className="text-[10px] text-muted-foreground">kg/ha (0–400)</span>
              {errors.k && <p className="text-[11px] text-destructive">{errors.k}</p>}
            </div>
          </div>
        </Panel>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL_FORM);
              setErrors({});
              setResults(null);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.recommend.reset}</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/95 disabled:opacity-75 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t.recommend.submitting}</span>
              </>
            ) : (
              <>
                <Sprout className="h-5 w-5 text-accent" />
                <span>{t.recommend.submit}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* RESULTS DISPLAY */}
      {results && (
        <section id="recommendation-results" className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {t.recommend.resultsTitle}
                </h2>
                <DemoBadge label={t.common.demoRuleEngine} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "kn"
                  ? `${form.taluk} ಭಾಗಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಅಗ್ರ ಬೆಳೆಗಳು`
                  : `Top ranked crops for ${form.taluk} region`}
              </p>
            </div>
          </div>

          <Notice tone="info">
            <p className="text-xs sm:text-sm leading-relaxed">
              {t.recommend.disclaimer}
            </p>
          </Notice>

          <div className="grid gap-5 sm:grid-cols-2">
            {results.map((r, idx) => (
              <article
                key={r.crop.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CropArt emoji={r.crop.emoji} size="md" />
                      <div>
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                          #{idx + 1} {lang === "kn" ? "ಶಿಫಾರಸು" : "Match"}
                        </span>
                        <h3 className="text-xl font-bold text-foreground">
                          {r.crop.name}
                        </h3>
                        <p className="text-sm font-semibold text-primary">
                          {r.crop.kannada}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-muted-foreground">
                        {lang === "kn" ? "ಹೊಂದಾಣಿಕೆ" : "Match"}
                      </div>
                      <div className="text-2xl font-black text-foreground">
                        {r.matchScore}%
                      </div>
                    </div>
                  </div>

                  {/* Match score bar */}
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${r.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Reasons why it suits */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-xs font-bold text-foreground">
                      {t.recommend.reasonsTitle}:
                    </div>
                    {(lang === "kn" ? r.reasonsKn : r.reasons).map((reason, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-foreground/90">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Risks & Limitations */}
                  {r.concerns.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs font-bold text-muted-foreground">
                        {t.recommend.limitationsTitle}:
                      </div>
                      {(lang === "kn" ? r.concernsKn : r.concerns).map((concern, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 text-warning-foreground shrink-0 mt-0.5" />
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Missing data transparency note */}
                  {r.missingDataNote && (
                    <p className="mt-3 text-[11px] text-muted-foreground italic rounded bg-muted/50 p-2">
                      ℹ️ {lang === "kn" ? r.missingDataNoteKn : r.missingDataNote}
                    </p>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-5 pt-3 border-t border-border grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDetail(r)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t.recommend.detailsBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(r.crop.id)}
                    className={`inline-flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-semibold transition ${
                      compare.includes(r.crop.id)
                        ? "border-primary bg-secondary text-primary font-bold"
                        : "border-border bg-card hover:border-primary text-foreground"
                    }`}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    <span>{t.recommend.compareBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(r)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition shadow-xs"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>{t.recommend.saveBtn}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Compare bar link if crops are chosen */}
          {compare.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-secondary p-4 border border-primary/20">
              <span className="text-sm font-semibold text-secondary-foreground">
                {lang === "kn"
                  ? `${compare.length} ಬೆಳೆಗಳನ್ನು ಹೋಲಿಕೆಗೆ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ`
                  : `${compare.length} crops selected to compare`}
              </span>
              <Link
                to="/profit"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {lang === "kn" ? "ವೆಚ್ಚ-ಲಾಭ ಹೋಲಿಸಿ" : "Compare Now"}
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Detail Dialog Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setDetail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <CropArt emoji={detail.crop.emoji} size="lg" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {detail.crop.name}
                </h3>
                <p className="text-base font-semibold text-primary">
                  {detail.crop.kannada}
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {lang === "kn" ? detail.crop.descriptionKn : detail.crop.description}
            </p>

            <div className="rounded-xl bg-secondary/50 p-3 text-xs space-y-1">
              <span className="font-bold text-primary">
                {lang === "kn" ? "ಪ್ರಾದೇಶಿಕ ಸಂಶೋಧನಾ ಸಾಕ್ಷ್ಯ:" : "Regional Research Rationale:"}
              </span>
              <p className="text-secondary-foreground">
                {lang === "kn" ? detail.crop.regionalRationaleKn : detail.crop.regionalRationale}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">
                {lang === "kn" ? "ಶಿಫಾರಸು ಮಾಡಿದ ಬೇಸಾಯ ಕ್ರಮಗಳು:" : "Recommended Cultivation Practices:"}
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground/90">
                {(lang === "kn" ? detail.crop.cultivationKn : detail.crop.cultivation).map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-primary">{i + 1}.</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to="/crops/$id"
                params={{ id: detail.crop.id }}
                className="flex-1 rounded-xl bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground hover:bg-primary/95"
              >
                {lang === "kn" ? "ಸಂಪೂರ್ಣ ಬೆಳೆ ಪುಟ ವೀಕ್ಷಿಸಿ" : "Full Crop Page"}
              </Link>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-center text-xs font-semibold text-foreground hover:bg-muted"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
