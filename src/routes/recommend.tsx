import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Loader2, Bookmark, Scale, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Notice, CropArt, DemoBadge, inputCls } from "@/components/common";
import { STATES, SOIL_TYPES, type Season, type WaterNeed } from "@/lib/crops";
import { mockRecommendCrops, suitabilityLabel, SAMPLE_INPUT, type FarmInput, type MockResult } from "@/lib/recommend";
import { useSaved, useCompare } from "@/lib/storage";
import { validateForm, type FormState } from "@/lib/validate";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation – KhetMitra" },
      { name: "description", content: "Enter soil nutrients, pH, weather and water to see crops that may suit your field." },
      { property: "og:title", content: "Crop Recommendation – KhetMitra" },
      { property: "og:description", content: "See crops that may suit your soil and weather." },
    ],
  }),
  component: RecommendPage,
});

const EMPTY: FormState = { n: "", p: "", k: "", ph: "", temperature: "", humidity: "", rainfall: "", state: "", district: "", soilType: "", season: "", water: "", irrigation: false, area: "", areaUnit: "acre" };
const toForm = (i: FarmInput): FormState => ({ ...i, n: String(i.n), p: String(i.p), k: String(i.k), ph: String(i.ph), temperature: String(i.temperature), humidity: String(i.humidity), rainfall: String(i.rainfall), area: i.area ? String(i.area) : "" });

const NUM_FIELDS: { key: keyof FormState; label: string; unit: string; help: string; group: "soil" | "env" }[] = [
  { key: "n", label: "Nitrogen (N)", unit: "kg/ha", help: "From your Soil Health Card. Usually 0–140.", group: "soil" },
  { key: "p", label: "Phosphorus (P)", unit: "kg/ha", help: "Usually 5–145.", group: "soil" },
  { key: "k", label: "Potassium (K)", unit: "kg/ha", help: "Usually 5–205.", group: "soil" },
  { key: "ph", label: "Soil pH", unit: "0–14", help: "7 is neutral. Below 6.5 is acidic, above 7.5 is alkaline.", group: "soil" },
  { key: "temperature", label: "Temperature", unit: "°C", help: "Average temperature during the season.", group: "env" },
  { key: "humidity", label: "Humidity", unit: "%", help: "Average moisture in the air, 0–100.", group: "env" },
  { key: "rainfall", label: "Rainfall", unit: "mm", help: "Expected rainfall in the season.", group: "env" },
];

function RecommendPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MockResult[] | null>(null);
  const [detail, setDetail] = useState<MockResult | null>(null);
  const [, setSaved] = useSaved();
  const [compare, setCompare] = useCompare();

  const set = (k: keyof FormState, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v, ...(k === "state" ? { district: "" } : {}) }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, data } = validateForm(form);
    setErrors(errs);
    if (!data) { toast.error("Please fix the highlighted fields."); return; }
    setLoading(true); setResults(null);
    setTimeout(() => {
      setResults(mockRecommendCrops(data));
      setLoading(false);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 700);
  };

  const save = (r: MockResult) => {
    setSaved((s) => [{ id: crypto.randomUUID(), savedAt: new Date().toISOString(), cropId: r.crop.id, cropName: r.crop.name, demoScore: r.demoScore, location: `${form.district}, ${form.state}`, season: form.season }, ...s]);
    toast.success(`${r.crop.name} saved`);
  };
  const toggleCompare = (id: string) => {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-3)));
  };

  const field = (k: keyof FormState) => errors[k] ? "border-destructive" : "";
  const Err = ({ k }: { k: keyof FormState }) => errors[k] ? <p role="alert" className="mt-1 text-sm text-destructive">{errors[k]}</p> : null;

  return (
    <div>
      <PageHeader title="Crop Recommendation" subtitle="Fill in what you know about your field." icon={<Sprout />}>
        <button type="button" onClick={() => { setForm(toForm(SAMPLE_INPUT)); setErrors({}); }} className="rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary">Fill sample values</button>
      </PageHeader>

      <form onSubmit={submit} noValidate className="space-y-5">
        {(["soil", "env"] as const).map((g) => (
          <Panel key={g} title={g === "soil" ? "1. Soil details" : "2. Weather details"}>
            <div className="grid gap-4 sm:grid-cols-2">
              {NUM_FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.key}>
                  <label htmlFor={f.key} className="mb-1 block font-semibold">{f.label} <span className="font-normal text-muted-foreground">({f.unit})</span></label>
                  <input id={f.key} inputMode="decimal" value={form[f.key] as string} onChange={(e) => set(f.key, e.target.value)} className={`${inputCls} ${field(f.key)}`} aria-invalid={!!errors[f.key]} />
                  <p className="mt-1 text-xs text-muted-foreground">{f.help}</p>
                  <Err k={f.key} />
                </div>
              ))}
            </div>
          </Panel>
        ))}

        <Panel title="3. Location, season and water">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="state" className="mb-1 block font-semibold">State</label>
              <select id="state" value={form.state} onChange={(e) => set("state", e.target.value)} className={`${inputCls} ${field("state")}`}>
                <option value="">Select state</option>
                {Object.keys(STATES).map((s) => <option key={s}>{s}</option>)}
              </select><Err k="state" />
            </div>
            <div>
              <label htmlFor="district" className="mb-1 block font-semibold">District</label>
              <select id="district" value={form.district} disabled={!form.state} onChange={(e) => set("district", e.target.value)} className={`${inputCls} ${field("district")}`}>
                <option value="">{form.state ? "Select district" : "Select state first"}</option>
                {(STATES[form.state] ?? []).map((d) => <option key={d}>{d}</option>)}
              </select><Err k="district" />
            </div>
            <div>
              <label htmlFor="soilType" className="mb-1 block font-semibold">Soil type <span className="font-normal text-muted-foreground">(if known)</span></label>
              <select id="soilType" value={form.soilType} onChange={(e) => set("soilType", e.target.value)} className={inputCls}>
                <option value="">Don't know</option>
                {SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <span className="mb-1 block font-semibold">Farm area <span className="font-normal text-muted-foreground">(optional)</span></span>
              <div className="flex gap-2">
                <input aria-label="Farm area" inputMode="decimal" value={form.area} onChange={(e) => set("area", e.target.value)} className={`${inputCls} ${field("area")}`} />
                <select aria-label="Area unit" value={form.areaUnit} onChange={(e) => set("areaUnit", e.target.value)} className={`${inputCls} w-32`}>
                  <option value="acre">acre</option><option value="hectare">hectare</option>
                </select>
              </div><Err k="area" />
            </div>
            <Choice label="Growing season" value={form.season} options={["Kharif", "Rabi", "Zaid"]} hints={["Jun–Oct, monsoon", "Oct–Mar, winter", "Mar–Jun, summer"]} onChange={(v) => set("season", v as Season)} error={errors.season} />
            <Choice label="Water availability" value={form.water} options={["Low", "Moderate", "High"]} onChange={(v) => set("water", v as WaterNeed)} error={errors.water} />
            <label className="flex items-center gap-3 rounded-lg border p-3 sm:col-span-2">
              <input type="checkbox" checked={form.irrigation} onChange={(e) => set("irrigation", e.target.checked)} className="h-5 w-5 accent-primary" />
              <span className="font-semibold">I have irrigation (canal, borewell, drip, etc.)</span>
            </label>
          </div>
        </Panel>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => { setForm(EMPTY); setErrors({}); setResults(null); }} className="rounded-xl border bg-card px-6 py-3.5 font-semibold">Reset</button>
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-elevated disabled:opacity-70">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Checking…</> : <><Sprout className="h-5 w-5" /> Show suitable crops</>}
          </button>
        </div>
      </form>

      {results && (
        <section id="results" className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold">Top 3 suggested crops</h2><DemoBadge label="Demo rule engine" /></div>
          <Notice tone="warn">These suggestions come from a simple <b>demo rule engine</b>, not a trained machine learning model. Scores are illustrative only — they are not real probabilities and have <b>not been scientifically validated</b> for your field. Please confirm with your local Krishi Vigyan Kendra (KVK) or agriculture officer.</Notice>
          <div className="grid gap-4 lg:grid-cols-3">
            {results.map((r, i) => (
              <article key={r.crop.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <CropArt emoji={r.crop.emoji} />
                  <div><div className="text-xs font-semibold text-muted-foreground">#{i + 1} suggestion</div><h3 className="text-xl font-semibold">{r.crop.name}</h3><div className="text-sm text-muted-foreground">{r.crop.hindi}</div></div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{suitabilityLabel(r.demoScore)}</span><span>Demo score {r.demoScore}/100</span></div>
                  <div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-primary" style={{ width: `${r.demoScore}%` }} /></div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {r.reasons.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{x}</li>)}
                  {r.concerns.map((x) => <li key={x} className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-warning-foreground" />{x}</li>)}
                </ul>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <Info k="Season" v={r.crop.seasons.join(", ")} />
                  <Info k="Water" v={r.crop.water} />
                  <Info k="Duration" v={`${r.crop.durationDays[0]}–${r.crop.durationDays[1]} days`} />
                  <Info k="Soil" v={r.crop.soils.slice(0, 2).join(", ")} />
                  <Info k="Temp" v={`${r.crop.temp[0]}–${r.crop.temp[1]}°C`} />
                  <Info k="pH" v={`${r.crop.ph[0]}–${r.crop.ph[1]}`} />
                </dl>
                <p className="mt-3 text-sm text-muted-foreground">{r.crop.cultivation[0]}.</p>
                <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
                  <button onClick={() => setDetail(r)} className="flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-semibold hover:border-primary"><Eye className="h-4 w-4" />Details</button>
                  <button onClick={() => toggleCompare(r.crop.id)} aria-pressed={compare.includes(r.crop.id)} className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-semibold ${compare.includes(r.crop.id) ? "border-primary bg-secondary" : "hover:border-primary"}`}><Scale className="h-4 w-4" />Compare</button>
                  <button onClick={() => save(r)} className="flex flex-col items-center gap-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground"><Bookmark className="h-4 w-4" />Save</button>
                </div>
              </article>
            ))}
          </div>
          {compare.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
              <span className="text-sm font-semibold">{compare.length} crop(s) selected to compare</span>
              <Link to="/profit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Compare now</Link>
            </div>
          )}
        </section>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-foreground/50 p-0 sm:p-4" onClick={() => setDetail(null)}>
          <div role="dialog" aria-modal className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3"><CropArt emoji={detail.crop.emoji} /><h3 className="text-2xl font-semibold">{detail.crop.name}</h3></div>
            <p className="mt-3">{detail.crop.description}</p>
            <h4 className="mt-4 font-semibold">How to grow</h4>
            <ul className="mt-1 list-disc pl-5 text-sm space-y-1">{detail.crop.cultivation.map((c) => <li key={c}>{c}</li>)}</ul>
            <div className="mt-5 flex gap-2">
              <Link to="/crops/$id" params={{ id: detail.crop.id }} className="flex-1 rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground">Full crop page</Link>
              <button onClick={() => setDetail(null)} className="flex-1 rounded-lg border py-3 font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return <div className="rounded-lg bg-muted px-3 py-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>;
}

function Choice({ label, value, options, hints, onChange, error }: { label: string; value: string; options: string[]; hints?: string[]; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset>
      <legend className="mb-1 font-semibold">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o, i) => (
          <button type="button" key={o} onClick={() => onChange(o)} aria-pressed={value === o}
            className={`rounded-lg border px-2 py-2.5 text-sm font-semibold ${value === o ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"} ${error ? "border-destructive" : ""}`}>
            {o}{hints && <span className="block text-[11px] font-normal opacity-80">{hints[i]}</span>}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}
