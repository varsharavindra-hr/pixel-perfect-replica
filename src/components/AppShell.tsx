import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Sprout,
  BookOpen,
  FlaskConical,
  CloudSun,
  Droplets,
  IndianRupee,
  Leaf,
  Bug,
  TrendingUp,
  Landmark,
  MessageCircle,
  Bookmark,
  User,
  Settings,
  Menu,
  X,
  Languages,
} from "lucide-react";
import { useI18n, type Language } from "@/lib/i18n";
import { useFarmerAuth } from "@/lib/storage";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useI18n();
  const { farmer } = useFarmerAuth();
  const { pathname } = useLocation();

  const NAV_ITEMS = [
    { to: "/", label: t.nav.dashboard, icon: LayoutDashboard },
    { to: "/recommend", label: t.nav.recommend, icon: Sprout, highlight: true },
    { to: "/crops", label: t.nav.crops, icon: BookOpen },
    { to: "/soil", label: t.nav.soil, icon: FlaskConical },
    { to: "/weather", label: t.nav.weather, icon: CloudSun },
    { to: "/water", label: t.nav.water, icon: Droplets },
    { to: "/profit", label: t.nav.profit, icon: IndianRupee },
    { to: "/fertilizer", label: t.nav.fertilizer, icon: Leaf },
    { to: "/pests", label: t.nav.pests, icon: Bug },
    { to: "/market", label: t.nav.market, icon: TrendingUp },
    { to: "/schemes", label: t.nav.schemes, icon: Landmark },
    { to: "/assistant", label: t.nav.assistant, icon: MessageCircle },
    { to: "/history", label: t.nav.history, icon: Bookmark },
    { to: "/profile", label: farmer.isLoggedIn ? (farmer.name || t.nav.profile) : t.nav.login, icon: User },
    { to: "/settings", label: t.nav.settings, icon: Settings },
  ];

  const BOTTOM_ITEMS = [
    { to: "/", label: lang === "kn" ? "ಮುಖಪುಟ" : "Home", icon: LayoutDashboard },
    { to: "/recommend", label: lang === "kn" ? "ಶಿಫಾರಸು" : "Recommend", icon: Sprout },
    { to: "/crops", label: lang === "kn" ? "ಬೆಳೆಗಳು" : "Crops", icon: BookOpen },
    { to: "/profile", label: farmer.isLoggedIn ? (lang === "kn" ? "ಪ್ರೊಫೈಲ್" : "Profile") : (lang === "kn" ? "ಲಾಗಿನ್" : "Login"), icon: User },
  ];

  function Brand() {
    return (
      <Link to="/" className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
          <Sprout className="h-6 w-6 text-accent" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-lg font-bold text-foreground">
            Raitha Bandhu
          </div>
          <div className="text-xs font-semibold text-primary">
            ರೈತ ಬಂಧು
          </div>
        </div>
      </Link>
    );
  }

  function LanguageToggle() {
    return (
      <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs font-semibold shadow-sm">
        <Languages className="mx-1 h-3.5 w-3.5 text-muted-foreground" />
        <button
          type="button"
          onClick={() => setLang("kn")}
          aria-pressed={lang === "kn"}
          className={`rounded px-2 py-1 transition-colors ${
            lang === "kn"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ಕನ್ನಡ
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
          className={`rounded px-2 py-1 transition-colors ${
            lang === "en"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 gap-4 overflow-y-auto z-20">
        <div className="pb-2 border-b border-sidebar-border flex items-center justify-between">
          <Brand />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-sidebar-foreground/75 font-medium">
            {lang === "kn" ? "ಭಾಷೆ ಆಯ್ಕೆ:" : "Language:"}
          </span>
          <LanguageToggle />
        </div>

        {/* Farmer Status card in Sidebar */}
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3 text-sidebar-accent-foreground hover:bg-sidebar-accent transition"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate">
              {farmer.isLoggedIn ? farmer.name : t.auth.title}
            </div>
            <div className="text-[11px] opacity-75 truncate">
              {farmer.isLoggedIn
                ? `${farmer.village || farmer.taluk}`
                : (lang === "kn" ? "ಲಾಗಿನ್ / ನೋಂದಣಿ" : "Login / Register")}
            </div>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, highlight }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : highlight
                    ? "text-accent bg-sidebar-accent/40 hover:bg-sidebar-accent"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary-foreground" : "text-primary"}`} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-3 border-t border-sidebar-border text-[11px] text-sidebar-foreground/70 space-y-1">
          <p className="font-semibold text-sidebar-foreground">
            {lang === "kn" ? "ಹಾರೋಹಳ್ಳಿ • ಕನಕಪುರ • ರಾಮನಗರ" : "Harohalli • Kanakapura • Ramanagara"}
          </p>
          <p className="text-[10px] opacity-80">
            {lang === "kn" ? "ವಲಯ 5 ಕೃಷಿ ಸಲಹಾ ವ್ಯವಸ್ಥೆ" : "Zone 5 Agricultural Advisory"}
          </p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-card border-b border-border px-4 py-2.5 shadow-sm">
        <Brand />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] bg-sidebar text-sidebar-foreground p-4 overflow-y-auto flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-sidebar-border">
              <Brand />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-sidebar-accent"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-sidebar-foreground/80 font-medium">
                {lang === "kn" ? "ಭಾಷೆ ಆಯ್ಕೆ:" : "Language:"}
              </span>
              <LanguageToggle />
            </div>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-3 text-sidebar-accent-foreground"
            >
              <User className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold">
                  {farmer.isLoggedIn ? farmer.name : t.auth.title}
                </div>
                <div className="text-xs opacity-75">
                  {farmer.isLoggedIn ? farmer.mobile : (lang === "kn" ? "ಲಾಗಿನ್ / ನೋಂದಣಿ ಮಾಡಿ" : "Login / Register")}
                </div>
              </div>
            </Link>

            <nav className="flex flex-col gap-1 overflow-y-auto">
              {NAV_ITEMS.map(({ to, label, icon: Icon, highlight }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                        : highlight
                        ? "text-accent bg-sidebar-accent/40"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pb-24 lg:pb-12 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 border-t border-border bg-card shadow-elevated">
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
                active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[60px]">{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span>{t.nav.more}</span>
        </button>
      </nav>
    </div>
  );
}
