import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, User, Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Notice, inputCls } from "@/components/common";
import { useI18n, type Language } from "@/lib/i18n";
import { useFarmerAuth, useLocalStorage } from "@/lib/storage";
import { REGIONAL_LOCATIONS } from "@/lib/crops";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Preferences & Language | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Choose between Kannada and English, and configure local region preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, t } = useI18n();
  const { farmer, updateProfile } = useFarmerAuth();
  const [unit, setUnit] = useLocalStorage("rb-unit", "acre");

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={t.nav.settings}
        subtitle={lang === "kn" ? "ಭಾಷೆ ಮತ್ತು ಸ್ಥಳೀಯ ಆದ್ಯತೆಗಳನ್ನು ಹೊಂದಿಸಿ" : "Configure language and regional preferences"}
        icon={<Settings />}
      />

      {/* Language Section - English and Kannada ONLY */}
      <Panel
        title={
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>{lang === "kn" ? "ಭಾಷಾ ಆಯ್ಕೆ (Language Support)" : "Language Selection"}</span>
          </div>
        }
      >
        <p className="text-xs text-muted-foreground mb-3">
          {lang === "kn"
            ? "ರೈತ ಬಂಧು ಅಪ್ಲಿಕೇಶನ್ ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗಳಲ್ಲಿ ಮಾತ್ರ ಲಭ್ಯವಿದೆ."
            : "Raitha Bandhu is available exclusively in natural Kannada and English."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLang(item.code);
                toast.success(
                  item.code === "kn"
                    ? "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ"
                    : "Language changed to English"
                );
              }}
              aria-pressed={lang === item.code}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                lang === item.code
                  ? "border-primary bg-secondary/80 text-foreground font-bold shadow-xs"
                  : "border-border bg-card hover:border-primary text-foreground"
              }`}
            >
              <div>
                <div className="text-lg font-bold">{item.nativeName}</div>
                <div className="text-xs text-muted-foreground">{item.name}</div>
              </div>
              {lang === item.code && (
                <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Panel>

      {/* Farm & Region Preferences */}
      <Panel title={lang === "kn" ? "ಪ್ರಾದೇಶಿಕ ಆದ್ಯತೆಗಳು" : "Regional Preferences"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              {lang === "kn" ? "ತಾಲೂಕು / ಪ್ರದೇಶ" : "Default Taluk / Region"}
            </label>
            <select
              value={farmer.taluk || "Kanakapura"}
              onChange={(e) => {
                updateProfile({ taluk: e.target.value });
                toast.success(lang === "kn" ? "ತಾಲೂಕು ಉಳಿಸಲಾಗಿದೆ" : "Taluk updated");
              }}
              className={inputCls}
            >
              {REGIONAL_LOCATIONS.map((loc) => (
                <option key={loc.taluk} value={loc.taluk}>
                  {loc.taluk} ({loc.talukKn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">
              {lang === "kn" ? "ಜಮೀನಿನ ಅಳತೆ ಮಾನದಂಡ" : "Farm Area Unit"}
            </label>
            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                toast.success(lang === "kn" ? "ಅಳತೆ ಮಾನದಂಡ ಬದಲಾಗಿದೆ" : "Unit updated");
              }}
              className={inputCls}
            >
              <option value="acre">{lang === "kn" ? "ಎಕರೆ (Acre)" : "Acre"}</option>
              <option value="hectare">{lang === "kn" ? "ಹೆಕ್ಟೇರ್ (Hectare)" : "Hectare"}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {lang === "kn" ? "ರೈತರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸಂಪರ್ಕ ಮಾಹಿತಿ:" : "Farmer profile and mobile registration:"}
          </span>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <User className="h-3.5 w-3.5" />
            <span>{t.nav.profile}</span>
          </Link>
        </div>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಡೆಮೊ ಆವೃತ್ತಿ ಸೂಚನೆ: ಈ ಅಪ್ಲಿಕೇಶನ್‌ನ ಎಲ್ಲಾ ಮಾಹಿತಿಯು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಸಂಗ್ರಹವಾಗಿರುತ್ತದೆ. ಯಾವುದೇ ಗೌಪ್ಯ ಮಾಹಿತಿ ಹೊರಗೆ ಹೋಗುವುದಿಲ್ಲ."
            : "Demo version notice: Information is preserved locally on this device. Future update will connect to persistent Python backend and secure database."}
        </p>
      </Notice>
    </div>
  );
}
