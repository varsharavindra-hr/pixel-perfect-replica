import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Sprout, BookOpen, FlaskConical, CloudSun, Droplets, IndianRupee,
  Leaf, Bug, TrendingUp, Landmark, MessageCircle, Bookmark, Settings, Menu, X,
} from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

type NavItem = { to: string; en: string; hi: string; icon: typeof Sprout };
export const NAV: NavItem[] = [
  { to: "/", en: "Dashboard", hi: "डैशबोर्ड", icon: LayoutDashboard },
  { to: "/recommend", en: "Crop Recommendation", hi: "फसल सुझाव", icon: Sprout },
  { to: "/crops", en: "Crop Explorer", hi: "फसल सूची", icon: BookOpen },
  { to: "/soil", en: "Soil Health", hi: "मिट्टी स्वास्थ्य", icon: FlaskConical },
  { to: "/weather", en: "Weather & Calendar", hi: "मौसम व कैलेंडर", icon: CloudSun },
  { to: "/water", en: "Water & Irrigation", hi: "पानी व सिंचाई", icon: Droplets },
  { to: "/profit", en: "Cost & Profit", hi: "लागत व मुनाफा", icon: IndianRupee },
  { to: "/fertilizer", en: "Fertilizer Guide", hi: "खाद मार्गदर्शन", icon: Leaf },
  { to: "/pests", en: "Pests & Diseases", hi: "कीट व रोग", icon: Bug },
  { to: "/market", en: "Market Prices", hi: "मंडी भाव", icon: TrendingUp },
  { to: "/schemes", en: "Govt. Schemes", hi: "सरकारी योजनाएं", icon: Landmark },
  { to: "/assistant", en: "Farming Assistant", hi: "खेती सहायक", icon: MessageCircle },
  { to: "/history", en: "Saved & History", hi: "सहेजे गए", icon: Bookmark },
  { to: "/settings", en: "Settings & Language", hi: "सेटिंग्स व भाषा", icon: Settings },
];
const BOTTOM = ["/", "/recommend", "/soil", "/market"];

function NavLinks({ onNavigate, lang }: { onNavigate?: () => void; lang: string }) {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, en, hi, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link key={to} to={to} onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
            <Icon className="h-5 w-5 shrink-0" />
            {lang === "hi" ? hi : en}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src="/icon-192.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
      <div className="leading-tight">
        <div className="font-display text-lg font-semibold">KhetMitra</div>
        <div className="text-[11px] opacity-75">Smart crop advisor</div>
      </div>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lang] = useLocalStorage("km-lang", "en");
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground p-4 gap-6 overflow-y-auto">
        <Brand />
        <NavLinks lang={lang} />
        <p className="mt-auto text-xs opacity-70">Demo version · sample data only</p>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-3">
        <Brand />
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-sidebar-accent">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[85%] bg-sidebar text-sidebar-foreground p-4 overflow-y-auto flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-sidebar-accent"><X className="h-6 w-6" /></button>
            </div>
            <NavLinks lang={lang} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 lg:ml-64 pb-24 lg:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 border-t bg-card shadow-elevated">
        {BOTTOM.map((to) => {
          const item = NAV.find((n) => n.to === to)!;
          const Icon = item.icon;
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              {(lang === "hi" ? item.hi : item.en).split(" ")[0]}
            </Link>
          );
        })}
        <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground">
          <Menu className="h-5 w-5" /> More
        </button>
      </nav>
    </div>
  );
}
