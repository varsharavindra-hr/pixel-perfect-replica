import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, BookOpen, FlaskConical, Bookmark, ArrowRight, UserCheck, LogIn, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useFarmerAuth, useSaved } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raitha Bandhu (ರೈತ ಬಂಧು) – Crop Advisory for Southern Bengaluru" },
      { name: "description", content: "Region-specific crop recommendations for Harohalli, Kanakapura & Southern Bengaluru farmers." },
      { property: "og:title", content: "Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { property: "og:description", content: "Practical crop advisory tailored to Harohalli, Kanakapura and Southern Bengaluru." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { lang, setLang, t } = useI18n();
  const { farmer } = useFarmerAuth();
  const [saved] = useSaved();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Top Header Card: Branding, Welcome, Language, Farmer Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              {lang === "kn" ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಕೃಷಿ ಸಲಹಾ ಸೇವೆ" : "Karnataka • Agricultural Advisory"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            {t.dashboard.welcome}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>
              {lang === "kn"
                ? "ಹಾರೋಹಳ್ಳಿ • ಕನಕಪುರ • ರಾಮನಗರ • ದಕ್ಷಿಣ ಬೆಂಗಳೂರು"
                : "Harohalli • Kanakapura • Ramanagara • Southern Bengaluru"}
            </span>
          </p>
        </div>

        {/* Quick Actions: Language Selector & Login/Profile */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {/* Language Selector */}
          <div className="inline-flex rounded-xl border border-border bg-background p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang("kn")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                lang === "kn"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                lang === "en"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
          </div>

          {/* Farmer Profile / Login Entry Point */}
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:border-primary transition"
          >
            {farmer.isLoggedIn ? (
              <>
                <UserCheck className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[100px]">{farmer.name || t.nav.profile}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 text-muted-foreground" />
                <span>{t.auth.title}</span>
              </>
            )}
          </Link>
        </div>
      </div>

      {/* Hero Section: Centered, Calm, Uncluttered with ONE Prominent Primary Action */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-secondary/70 via-background to-card p-6 sm:p-10 text-center shadow-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sprout className="h-4 w-4" />
            <span>{t.dashboard.tagline}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-snug">
            {lang === "kn"
              ? "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ನೀರಿಗೆ ಸರಿಹೊಂದುವ ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಆರಿಸಿ"
              : "Identify the Most Suitable Crops for Your Land & Water"}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t.dashboard.description}
          </p>

          {/* ONE PROMINENT PRIMARY ACTION */}
          <div className="pt-4">
            <Link
              to="/recommend"
              id="get-recommendation-cta"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-md transition hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sprout className="h-6 w-6 text-accent" />
              <span>{t.dashboard.primaryAction}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/80 pt-2">
            {lang === "kn"
              ? "ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಶಿಫಾರಸು ಪಡೆಯಿರಿ • ಮಣ್ಣು ಪರೀಕ್ಷೆ ಕಡ್ಡಾಯವಲ್ಲ"
              : "Get personalized regional guidance in 2 minutes • Soil test optional"}
          </p>
        </div>
      </section>

      {/* Regional Focus Banner */}
      <div className="rounded-2xl border border-primary/15 bg-secondary/40 p-4 text-sm text-foreground flex items-start gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary shrink-0 mt-0.5">
          <MapPin className="h-4 w-4" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold text-primary">
            {lang === "kn" ? "ಪ್ರಾದೇಶಿಕ ಪರಿಶೀಲನೆ:" : "Regional Verification:"}
          </span>{" "}
          {t.dashboard.regionNotice}
        </div>
      </div>

      {/* Minimal Secondary Navigation Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          {t.dashboard.secondaryTitle}
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/crops"
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary transition group shadow-xs"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition mb-3">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-foreground text-base">
                {t.dashboard.cropExplorerTitle}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.cropExplorerDesc}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-4">
              <span>{lang === "kn" ? "ಬೆಳೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ" : "Explore crops"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            to="/soil"
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary transition group shadow-xs"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition mb-3">
                <FlaskConical className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-foreground text-base">
                {t.dashboard.soilTitle}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.soilDesc}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-4">
              <span>{lang === "kn" ? "ಮಣ್ಣಿನ ಮಾಹಿತಿ" : "Check soil"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            to="/history"
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary transition group shadow-xs"
          >
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition mb-3">
                <Bookmark className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-foreground text-base">
                  {t.dashboard.historyTitle}
                </h4>
                {saved.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {saved.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.historyDesc}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-4">
              <span>{lang === "kn" ? "ಉಳಿಸಿದ ಪಟ್ಟಿ" : "View saved"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Honest Advisory Footnote */}
      <footer className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {t.dashboard.disclaimer}
        </p>
        <p className="text-[11px] text-muted-foreground/75 mt-2">
          {lang === "kn"
            ? "ಸಂಪರ್ಕ: ಕೃಷಿ ಇಲಾಖೆ ಸಹಾಯವಾಣಿ 1800-180-1551 • ಬೆಂಗಳೂರು ಕೃಷಿ ವಿವಿ (GKVK)"
            : "Kisan Call Centre: 1800-180-1551 • UAS Bengaluru (GKVK)"}
        </p>
      </footer>
    </div>
  );
}
