import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Trash2, Sprout, ArrowRight } from "lucide-react";
import { PageHeader, Panel, CropArt } from "@/components/common";
import { useSaved } from "@/lib/storage";
import { getCrop } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Saved Recommendations | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "View and revisit previously saved crop recommendations on this device." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [saved, setSaved] = useSaved();
  const { lang, t } = useI18n();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.history}
        subtitle={
          lang === "kn"
            ? "ಈ ಸಾಧನದಲ್ಲಿ ನೀವು ಉಳಿಸಿದ ಬೆಳೆ ಶಿಫಾರಸುಗಳ ವಿವರಗಳು"
            : "Review crop suggestions saved on this device"
        }
        icon={<Bookmark />}
      >
        {saved.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(lang === "kn" ? "ಉಳಿಸಿದ ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ಅಳಿಸಬೇಕೇ?" : "Delete all saved crops?")) {
                setSaved([]);
              }
            }}
            className="rounded-xl border border-destructive/30 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
          >
            {lang === "kn" ? "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ" : "Clear All"}
          </button>
        )}
      </PageHeader>

      {saved.length === 0 ? (
        <Panel>
          <div className="text-center py-10 space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
              <Bookmark className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {lang === "kn"
                ? "ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಉಳಿಸಿಲ್ಲ. ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆದು 'ಉಳಿಸಿ' ಬಟನ್ ಒತ್ತಿರಿ."
                : "No saved crop recommendations yet. Generate suggestions from the recommendation tool and tap Save."}
            </p>
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition shadow-xs"
            >
              <Sprout className="h-4 w-4" />
              <span>{t.nav.recommend}</span>
            </Link>
          </div>
        </Panel>
      ) : (
        <div className="space-y-3">
          {saved.map((s) => {
            const crop = getCrop(s.cropId);
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CropArt emoji={crop?.emoji ?? "🌱"} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/crops/$id"
                        params={{ id: s.cropId }}
                        className="font-bold text-base hover:text-primary transition truncate"
                      >
                        {s.cropName}
                      </Link>
                      {s.cropKannada && (
                        <span className="text-xs font-semibold text-primary truncate">
                          ({s.cropKannada})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {s.location} • {s.season} • {lang === "kn" ? "ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್:" : "Score:"} {s.matchScore}%
                    </div>
                    <div className="text-[10px] text-muted-foreground/75 mt-0.5">
                      {new Date(s.savedAt).toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/crops/$id"
                    params={{ id: s.cropId }}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
                  >
                    <span>{lang === "kn" ? "ವಿವರ" : "View"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    aria-label={`Delete ${s.cropName}`}
                    onClick={() => setSaved(saved.filter((x) => x.id !== s.id))}
                    className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
