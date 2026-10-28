import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, AlertTriangle, Bookmark, Sprout, Calendar, Droplets, MapPin } from "lucide-react";
import { toast } from "sonner";
import { CropArt, Panel, Notice, DemoBadge } from "@/components/common";
import { getCrop } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/storage";

export const Route = createFileRoute("/crops/$id")({
  loader: ({ params }) => {
    const crop = getCrop(params.id);
    if (!crop) throw notFound();
    return { crop };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.crop.name} (${loaderData.crop.kannada}) | Raitha Bandhu` },
          { name: "description", content: loaderData.crop.description },
          { property: "og:title", content: `${loaderData.crop.name} – Cultivation Guide` },
        ]
      : [{ title: "Crop Not Found | Raitha Bandhu" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="text-center py-12 space-y-3">
      <h2 className="text-2xl font-bold">ಬೆಳೆ ಕಂಡುಬಂದಿಲ್ಲ (Crop Not Found)</h2>
      <p className="text-sm text-muted-foreground">The requested regional crop does not exist in our curated catalogue.</p>
      <Link to="/crops" className="inline-block mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground">
        ಬೆಳೆಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ (Back to Crop Explorer)
      </Link>
    </div>
  ),
  component: CropDetail,
});

function CropDetail() {
  const { crop: c } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const [saved, setSaved] = useSaved();

  const handleSave = () => {
    if (saved.some((s) => s.cropId === c.id)) {
      toast.info(lang === "kn" ? "ಈ ಬೆಳೆ ಈಗಾಗಲೇ ಉಳಿಸಲಾಗಿದೆ" : `${c.name} is already saved`);
      return;
    }
    setSaved([
      {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        cropId: c.id,
        cropName: c.name,
        cropKannada: c.kannada,
        matchScore: 90,
        matchLevel: "High",
        location: "Kanakapura / Harohalli",
        season: c.seasons[0] ?? "Kharif",
      },
      ...saved,
    ]);
    toast.success(lang === "kn" ? `${c.kannada} ಉಳಿಸಲಾಗಿದೆ!` : `${c.name} saved to your profile!`);
  };

  const rows = [
    [lang === "kn" ? "ಸೂಕ್ತ ಬಿತ್ತನೆ ಹಂಗಾಮು" : "Suitable Seasons", c.seasons.join(", ")],
    [lang === "kn" ? "ನೀರಿನ ಅವಶ್ಯಕತೆ" : "Water Requirement", c.water === "Low" ? (lang === "kn" ? "ಕಡಿಮೆ (ಮಳೆಯಾಶ್ರಿತ)" : "Low (Rainfed)") : c.water === "Moderate" ? (lang === "kn" ? "ಸಾಧಾರಣ" : "Moderate") : (lang === "kn" ? "ಹೆಚ್ಚು (ಖಚಿತ ನೀರಾವರಿ)" : "High (Assured)")],
    [lang === "kn" ? "ಬೆಳೆಯ ಅವಧಿ" : "Duration", `${c.durationDays[0]}–${c.durationDays[1]} ${t.common.days}`],
    [lang === "kn" ? "ಸೂಕ್ತ ತಾಪಮಾನ" : "Temperature Range", `${c.temp[0]}–${c.temp[1]} °C`],
    [lang === "kn" ? "ಅಗತ್ಯವಿರುವ ಮಳೆ" : "Rainfall Range", `${c.rainfall[0]}–${c.rainfall[1]} mm`],
    [lang === "kn" ? "ಮಣ್ಣಿನ ಪಿ.ಎಚ್ (pH)" : "Soil pH Range", `${c.ph[0]}–${c.ph[1]}`],
    [lang === "kn" ? "ಸೂಕ್ತ ಮಣ್ಣಿನ ಪ್ರಕಾರಗಳು" : "Ideal Soil Types", c.soils.join(", ")],
    [lang === "kn" ? "ಪೋಷಕಾಂಶಗಳ ಶಿಫಾರಸು (N-P-K)" : "N-P-K (kg/ha)", `${c.npk.n.join("–")} / ${c.npk.p.join("–")} / ${c.npk.k.join("–")} kg/ha`],
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/crops"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.explorer.backToList}</span>
        </Link>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold hover:border-primary transition"
        >
          <Bookmark className="h-3.5 w-3.5 text-primary" />
          <span>{lang === "kn" ? "ಪ್ರೊಫೈಲ್‌ಗೆ ಉಳಿಸಿ" : "Save to Profile"}</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <CropArt emoji={c.emoji} size="lg" />
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>{t.explorer.establishedRegionalCrop}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
            {c.name}
          </h1>
          <p className="text-lg font-bold text-primary">
            {c.kannada} • <span className="font-normal text-muted-foreground text-sm">{c.type}</span>
          </p>
        </div>
      </div>

      {/* Description */}
      <Panel title={lang === "kn" ? "ಬೆಳೆಯ ಪರಿಚಯ" : "Crop Overview"}>
        <p className="text-base text-foreground leading-relaxed">
          {lang === "kn" ? c.descriptionKn : c.description}
        </p>
      </Panel>

      {/* Regional Rationale & Historical Context */}
      <div className="rounded-2xl border border-primary/20 bg-secondary/50 p-5 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <MapPin className="h-4 w-4" />
          <span>{t.explorer.regionalRationale}</span>
        </div>
        <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
          {lang === "kn" ? c.regionalRationaleKn : c.regionalRationale}
        </p>
      </div>

      {/* Growing conditions & Cultivation practices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t.explorer.growingConditions}>
          <dl className="divide-y divide-border text-xs sm:text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold text-foreground text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title={t.explorer.howToGrow}>
          <ol className="space-y-3 text-xs sm:text-sm text-foreground">
            {(lang === "kn" ? c.cultivationKn : c.cultivation).map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* Limitations and Risks */}
      <Panel title={t.explorer.limitations}>
        <div className="space-y-2">
          {(lang === "kn" ? c.limitationsKn : c.limitations).map((lim, i) => (
            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
              <span>{lim}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಗಮನಿಸಿ: ಈ ಶಿಫಾರಸುಗಳು ಬೆಂಗಳೂರು ಕೃಷಿ ವಿವಿ (GKVK) ಮತ್ತು ರಾಮನಗರ ಕೆವಿಕೆ ಕ್ಷೇತ್ರ ಪರೀಕ್ಷೆಗಳ ಆಧಾರದ ಮೇಲಿವೆ. ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣು ಮತ್ತು ಅಂತರ್ಜಲಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."
            : "Guidance sourced from UAS Bengaluru (GKVK) and Ramanagara KVK field trials. Always verify with your local Raitha Samparka Kendra or agriculture officer."}
        </p>
      </Notice>
    </div>
  );
}
