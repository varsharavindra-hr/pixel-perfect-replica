import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bug, Upload, Loader2 } from "lucide-react";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/pests")({
  head: () => seo("Pest & Disease Identification", "Check common crop pest and disease symptoms and safe control steps."),
  component: PestPage,
});

const PESTS = [
  { name: "Fall armyworm", crop: "Maize", sign: "Holes in leaves, sawdust-like waste in whorl", fix: "Hand-pick egg masses, use pheromone traps, spray neem oil 5 ml/L early." },
  { name: "Pink bollworm", crop: "Cotton", sign: "Rosette flowers, damaged bolls with pink larvae", fix: "Pheromone traps, destroy crop residue, timely harvest." },
  { name: "Aphids", crop: "Mustard", sign: "Small green/black insects on shoots, sticky leaves", fix: "Yellow sticky traps, spray neem oil; encourage ladybird beetles." },
  { name: "Blast", crop: "Rice", sign: "Eye-shaped grey spots with brown edges on leaves", fix: "Avoid excess nitrogen, use resistant varieties, consult KVK for fungicide." },
  { name: "Leaf curl virus", crop: "Tomato", sign: "Curled, yellow, small leaves; stunted plant", fix: "Remove infected plants, control whitefly, use resistant seed." },
  { name: "Pod borer", crop: "Chickpea", sign: "Round holes in pods, green caterpillars", fix: "Bird perches (T-shaped sticks), NPV spray, pheromone traps." },
];

function PestPage() {
  const [q, setQ] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [demo, setDemo] = useState<typeof PESTS[number] | null>(null);
  const list = PESTS.filter((p) => `${p.name} ${p.crop} ${p.sign}`.toLowerCase().includes(q.toLowerCase()));
  const onFile = (f?: File) => {
    if (!f) return;
    setFile(URL.createObjectURL(f)); setDemo(null); setChecking(true);
    setTimeout(() => { setDemo(PESTS[f.name.length % PESTS.length]); setChecking(false); }, 900);
  };
  return (
    <div className="space-y-5">
      <PageHeader title="Pest & Disease Identification" subtitle="Find what's harming your crop and how to manage it." icon={<Bug />} />
      <Panel title="Upload a leaf photo" action={<DemoBadge label="Simulated" />}>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center hover:border-primary">
          {file ? <img src={file} alt="Uploaded crop" className="h-40 rounded-lg object-cover" /> : <Upload className="h-8 w-8 text-primary" />}
          <span className="font-semibold">Tap to choose or take a photo</span>
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {checking && <p className="mt-3 flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Looking at photo…</p>}
        {demo && <div className="mt-3 rounded-xl bg-warning/15 p-4 text-sm"><b>Demo result:</b> {demo.name} ({demo.crop}). This is a <b>simulated</b> answer — no image recognition is connected yet. Compare symptoms below and confirm with an expert.</div>}
      </Panel>
      <input aria-label="Search pests" placeholder="Search by crop or symptom…" value={q} onChange={(e) => setQ(e.target.value)} className={inputCls} />
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((p) => (
          <article key={p.name} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{p.name}</h2><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold">{p.crop}</span></div>
            <p className="mt-2 text-sm"><b>Signs:</b> {p.sign}</p>
            <p className="mt-1 text-sm"><b>What to do:</b> {p.fix}</p>
          </article>
        ))}
      </div>
      <Notice>Always read the label and wear protection when spraying. Call the Kisan Call Centre at <b>1800-180-1551</b> (free) for expert help.</Notice>
    </div>
  );
}
