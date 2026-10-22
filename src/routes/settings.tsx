import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Notice, inputCls } from "@/components/common";
import { useLocalStorage } from "@/lib/storage";
import { STATES } from "@/lib/crops";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings & Language", "Choose your language, home state and units."),
  component: SettingsPage,
});

function SettingsPage() {
  const [lang, setLang] = useLocalStorage("km-lang", "en");
  const [state, setState] = useLocalStorage("km-state", "");
  const [unit, setUnit] = useLocalStorage("km-unit", "acre");
  const langs = [["en", "English"], ["hi", "हिन्दी (Hindi)"], ["mr", "मराठी (coming soon)"], ["ta", "தமிழ் (coming soon)"]];
  return (
    <div className="space-y-5">
      <PageHeader title="Settings & Language" subtitle="Saved on this device." icon={<Settings />} />
      <Panel title="Language">
        <div className="grid gap-2 sm:grid-cols-2">
          {langs.map(([code = "en", label]) => {
            const soon = code === "mr" || code === "ta";
            return (
              <button key={code} disabled={soon} onClick={() => { setLang(code); toast.success("Language updated"); }} aria-pressed={lang === code}
                className={`rounded-xl border p-4 text-left font-semibold disabled:opacity-50 ${lang === code ? "border-primary bg-secondary" : "hover:border-primary"}`}>{label}</button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Hindi currently changes the menu labels. Full translation is coming later.</p>
      </Panel>
      <Panel title="Farm preferences">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="font-semibold">Home state<select value={state} onChange={(e) => setState(e.target.value)} className={`${inputCls} mt-1`}><option value="">Not set</option>{Object.keys(STATES).map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="font-semibold">Area unit<select value={unit} onChange={(e) => setUnit(e.target.value)} className={`${inputCls} mt-1`}><option value="acre">Acre</option><option value="hectare">Hectare</option></select></label>
        </div>
      </Panel>
      <Panel title="Install the app">
        <p className="text-sm">On Android Chrome, open the menu (⋮) and tap <b>Add to Home screen</b> or <b>Install app</b>. KhetMitra will open like a normal app.</p>
      </Panel>
      <Notice>This is a demo version. All data shown is sample data, and suggestions come from a simple rule engine — not a trained AI model. No personal data leaves your device.</Notice>
    </div>
  );
}
