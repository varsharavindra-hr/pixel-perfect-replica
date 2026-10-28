import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bug, Upload, Loader2, AlertCircle } from "lucide-react";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/pests")({
  head: () => ({
    meta: [
      { title: "Pest & Disease Advisory | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Identify common regional crop pests and diseases with safe management steps." },
    ],
  }),
  component: PestPage,
});

interface RegionalPest {
  name: string;
  nameKn: string;
  crop: string;
  cropKn: string;
  sign: string;
  signKn: string;
  fix: string;
  fixKn: string;
}

const REGIONAL_PESTS: RegionalPest[] = [
  {
    name: "Ragi Finger Blast",
    nameKn: "ರಾಗಿ ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)",
    crop: "Ragi",
    cropKn: "ರಾಗಿ",
    sign: "Spindle-shaped brown lesions on leaves and neck rot of earheads during humid foggy weather.",
    signKn: "ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ಕಣ್ಣಿನಾಕಾರದ ಚುಕ್ಕೆಗಳು ಮತ್ತು ತೆನೆಯ ಕತ್ತಿನ ಭಾಗ ಕಪ್ಪಾಗಿ ಮುರಿದು ಬೀಳುತ್ತದೆ.",
    fix: "Use blast-tolerant varieties (GPU-28, ML-365). Avoid excessive urea top-dressing. Spray Tricyclazole 0.6g/L if neck blast appears.",
    fixKn: "ಬೆಂಕಿ ರೋಗ ನಿರೋಧಕ ತಳಿ (ಜಿಪಿಯು-28, ಎಂಎಲ್-365) ಬೆಳೆಯಿರಿ. ಅತಿಯಾದ ಯೂರಿಯಾ ಬೇಡ. ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಕೃಷಿ ಅಧಿಕಾರಿ ಸಲಹೆಯಂತೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.",
  },
  {
    name: "Fall Armyworm (FAW)",
    nameKn: "ಮುಸುಕಿನ ಜೋಳದ ಸೈನಿಕ ಹುಳು",
    crop: "Maize",
    cropKn: "ಮುಸುಕಿನ ಜೋಳ",
    sign: "Shot holes in leaf whorls accompanied by coarse sawdust-like fecal matter.",
    signKn: "ಸುಳಿಯ ಎಲೆಗಳಲ್ಲಿ ರಂಧ್ರಗಳು ಮತ್ತು ಮರದ ಪುಡಿಯಂತಹ ಹಿಕ್ಕೆಗಳು ಕಂಡುಬರುತ್ತವೆ.",
    fix: "Install pheromone traps early. Apply neem oil 5 ml/L at first instar larvae. In severe cases apply Emamectin benzoate 0.4g/L directly into the whorl.",
    fixKn: "ಆರಂಭದಲ್ಲೇ ಲಿಂಗಾಕರ್ಷಕ ಬಲೆ ಅಳವಡಿಸಿ. ಸಣ್ಣ ಹುಳುಗಳಿದ್ದಾಗ 5 ಮಿ.ಲೀ ಬೇವಿನೆಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ತೀವ್ರವಾಗಿದ್ದರೆ ಸುಳಿಗೆ ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೊಯೇಟ್ ಸಿಂಪಡಿಸಿ.",
  },
  {
    name: "Pod Borer (Helicoverpa)",
    nameKn: "ತೊಗರಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು",
    crop: "Red Gram",
    cropKn: "ತೊಗರಿ",
    sign: "Caterpillars boring circular holes in flower buds and green developing pods.",
    signKn: "ಹೂವು ಮೊಗ್ಗುಗಳು ಹಾಗೂ ಕಾಯಿಗಳಿಗೆ ರಂಧ್ರ ಕೊರೆದು ಕಾಳು ತಿನ್ನುವ ಹಸಿರು ಅಥವಾ ಕಂದು ಹುಳುಗಳು.",
    fix: "Install T-shaped bird perches in the field. Spray HaNPV or Chlorantraniliprole 0.3ml/L at early pod formation.",
    fixKn: "ಹಕ್ಕಿಗಳು ಕುಳಿತು ಹುಳು ತಿನ್ನಲು ಹೊಲದಲ್ಲಿ 'T' ಆಕಾರದ ಕೋಲುಗಳನ್ನು ನೆಡಿ. ಹೂವಾಡುವಾಗ ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಜೈವಿಕ ಅಥವಾ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ.",
  },
  {
    name: "Tomato Leaf Curl Virus (ToLCV)",
    nameKn: "ಟೊಮೇಟೊ ಎಲೆ ಮುರುಟು ರೋಗ",
    crop: "Tomato",
    cropKn: "ಟೊಮೇಟೊ",
    sign: "Upward leaf curling, thick leathery leaves, and stunted pale yellow bushes.",
    signKn: "ಎಲೆಗಳು ಮೇಲ್ಮುಖವಾಗಿ ಮುರುಟಿಕೊಂಡು ಗಿಡ ಕುಬ್ಜವಾಗುವುದು ಹಾಗೂ ಹಳದಿಯಾಗುವುದು.",
    fix: "Vector transmitted by Whiteflies. Install yellow sticky traps (10/acre) and spray systemic insecticide at nursery stage.",
    fixKn: "ಬಿಳಿ ನೊಣಗಳಿಂದ ಹರಡುತ್ತದೆ. ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ ಮತ್ತು ನರ್ಸರಿ ಹಂತದಲ್ಲೇ ಬಿಳಿ ನೊಣ ನಿಯಂತ್ರಣ ಮಾಡಿ.",
  },
  {
    name: "Brinjal Fruit & Shoot Borer",
    nameKn: "ಬದನೆಕಾಯಿ ಕುಡಿ ಮತ್ತು ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು",
    crop: "Brinjal",
    cropKn: "ಬದನೆಕಾಯಿ",
    sign: "Drooping withered vegetative tips and exit bore holes plugged with frass in fruit.",
    signKn: "ಗಿಡದ ಎಳೆಯ ಕುಡಿಗಳು ಒಣಗಿ ಜೋತು ಬೀಳುತ್ತವೆ ಮತ್ತು ಕಾಯಿಗಳಲ್ಲಿ ರಂಧ್ರ ಕಂಡುಬರುತ್ತದೆ.",
    fix: "Regularly clip and bury withered shoots. Use pheromone traps (Lucinlure). Avoid continuous solanaceous monoculture.",
    fixKn: "ಬಾಡಿದ ಕುಡಿಗಳನ್ನು ಮುರಿದು ಮಣ್ಣಿನಲ್ಲಿ ಹೂತುಹಾಕಿ. ಲ್ಯೂಸಿನ್ಲ್ಯೂರ್ ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು ಕಟ್ಟಿ.",
  },
  {
    name: "Mulberry Tukra (Mealybug) & Uzi Fly",
    nameKn: "ಹಿಪ್ಪುನೇರಳೆ ತುಕ್ರ ರೋಗ ಮತ್ತು ಉಜಿ ನೊಣ",
    crop: "Mulberry / Sericulture",
    cropKn: "ಹಿಪ್ಪುನೇರಳೆ / ರೇಷ್ಮೆ",
    sign: "Curled malformed dark green leaves in mulberry; dark maggots attacking silkworms.",
    signKn: "ಹಿಪ್ಪುನೇರಳೆ ಕುಡಿಗಳು ಗಂಟು ಕಟ್ಟಿ ಎಲೆಗಳು ಸುರುಟಿಕೊಳ್ಳುವುದು; ರೇಷ್ಮೆ ಹುಳುಗಳಿಗೆ ಉಜಿ ನೊಣ ಕಚ್ಚುವುದು.",
    fix: "Release Cryptolaemus ladybird beetles. For uzi fly, install wire-mesh on silkworm rearing house doors and windows.",
    fixKn: "ತುಕ್ರ ರೋಗಕ್ಕೆ ಪರಭಕ್ಷಕ ದುಂಬಿಗಳನ್ನು ಬಿಡಿ. ಹುಳು ಸಾಕಣೆ ಮನೆಯ ಕಿಟಕಿಗಳಿಗೆ ಸೊಳ್ಳೆ ತಂತಿ (ಉಜಿ ಜಾಲರಿ) ಅಳವಡಿಸಿ.",
  },
];

function PestPage() {
  const { lang, t } = useI18n();
  const [q, setQ] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [demoPest, setDemoPest] = useState<RegionalPest | null>(null);

  const filtered = REGIONAL_PESTS.filter((p) => {
    const text = `${p.name} ${p.nameKn} ${p.crop} ${p.cropKn} ${p.sign} ${p.signKn}`.toLowerCase();
    return text.includes(q.toLowerCase().trim());
  });

  const handleFileUpload = (f?: File) => {
    if (!f) return;
    setFile(URL.createObjectURL(f));
    setDemoPest(null);
    setChecking(true);
    setTimeout(() => {
      const selected = REGIONAL_PESTS[f.name.length % REGIONAL_PESTS.length];
      setDemoPest(selected ?? null);
      setChecking(false);
    }, 850);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.pests}
        subtitle={
          lang === "kn"
            ? "ಪ್ರಾದೇಶಿಕ ಬೆಳೆಗಳ ಪ್ರಮುಖ ಕೀಟ-ರೋಗ ಲಕ್ಷಣಗಳು ಮತ್ತು ಪರಿಸರಸ್ನೇಹಿ ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು"
            : "Diagnostic guide and management for Southern Bengaluru crop pests"
        }
        icon={<Bug />}
      >
        <DemoBadge label={lang === "kn" ? "ರೋಗ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶಿ" : "Pest Diagnostic Guide"} />
      </PageHeader>

      {/* Simulated Leaf Photo Upload */}
      <Panel
        title={lang === "kn" ? "ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ (ಡೆಮೊ ಸ್ಕ್ಯಾನರ್)" : "Leaf Symptom Scanner (Demo)"}
        action={<DemoBadge label={lang === "kn" ? "ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೆಮೊ" : "Simulated Demo"} />}
      >
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center hover:border-primary transition bg-muted/20">
          {file ? (
            <img src={file} alt="Uploaded leaf" className="h-36 rounded-xl object-cover shadow-sm" />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
              <Upload className="h-6 w-6" />
            </div>
          )}
          <span className="text-sm font-semibold text-foreground">
            {lang === "kn" ? "ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಆರಿಸಲು ಇಲ್ಲಿ ಒತ್ತಿ" : "Tap to capture or upload leaf photo"}
          </span>
          <span className="text-xs text-muted-foreground">
            {lang === "kn" ? "ಕ್ಯಾಮೆರಾ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ" : "Supports JPEG, PNG photos"}
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
        </label>

        {checking && (
          <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{lang === "kn" ? "ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…" : "Analyzing leaf photo against regional symptoms…"}</span>
          </p>
        )}

        {demoPest && (
          <div className="mt-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-xs text-warning-foreground space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {lang === "kn"
                  ? `ಡೆಮೊ ಫಲಿತಾಂಶ: ${demoPest.nameKn} (${demoPest.cropKn})`
                  : `Simulated Match: ${demoPest.name} (${demoPest.crop})`}
              </span>
            </div>
            <p className="leading-relaxed">
              {lang === "kn"
                ? "ಗಮನಿಸಿ: ಇದು ಡೆಮೊ ಪ್ರದರ್ಶನವಾಗಿದೆ. ಮುಂಬರುವ ಪೈಥಾನ್ ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಮಾದರಿಗೆ ಸಂಪರ್ಕಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ರೋಗ ಲಕ್ಷಣಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ."
                : "Note: This is an illustrative demo. Frontend integration point ready for future Python computer-vision backend. Always cross-verify with below diagnostic keys."}
            </p>
          </div>
        )}
      </Panel>

      {/* Search box */}
      <input
        aria-label="Search pests"
        placeholder={
          lang === "kn"
            ? "ಬೆಳೆ ಅಥವಾ ರೋಗದ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ (ರಾಗಿ, ಜೋಳ, ಟೊಮೇಟೊ, ರೇಷ್ಮೆ)…"
            : "Search by crop or pest name (ragi, maize, tomato, sericulture)…"
        }
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={inputCls}
      />

      {/* Grid of Regional Pests */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <article
            key={p.name}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:border-primary transition"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-foreground">
                {lang === "kn" ? p.nameKn : p.name}
              </h2>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                {lang === "kn" ? p.cropKn : p.crop}
              </span>
            </div>

            <div className="text-xs text-foreground/90 space-y-1">
              <p>
                <b className="text-foreground">{lang === "kn" ? "ರೋಗ ಲಕ್ಷಣಗಳು:" : "Symptoms:"}</b>{" "}
                {lang === "kn" ? p.signKn : p.sign}
              </p>
              <p className="pt-1">
                <b className="text-primary">{lang === "kn" ? "ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು:" : "Management:"}</b>{" "}
                {lang === "kn" ? p.fixKn : p.fix}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಕೀಟನಾಶಕ ಬಳಸುವಾಗ ಸುರಕ್ಷತಾ ಮುಖಗವಸು ಧರಿಸಿ. ಉಚಿತ ತಜ್ಞ ಕೃಷಿ ಸಲಹೆಗಾಗಿ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ."
            : "Always follow pre-harvest intervals and wear safety masks while spraying. For government advisory, call Kisan Call Centre 1800-180-1551."}
        </p>
      </Notice>
    </div>
  );
}
