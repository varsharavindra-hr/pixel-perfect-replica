import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, Phone, CheckCircle, ArrowLeft, LogOut, Bookmark, Save, Trash2, Sprout, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { useI18n } from "@/lib/i18n";
import { useFarmerAuth, useSaved } from "@/lib/storage";
import { REGIONAL_LOCATIONS, SOIL_TYPES, getCrop } from "@/lib/crops";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile & Login | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Simple OTP login and farm profile management for Karnataka farmers." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { lang, setLang, t } = useI18n();
  const { farmer, login, logout, updateProfile } = useFarmerAuth();
  const [saved, setSaved] = useSaved();

  // Auth flow state
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [mobile, setMobile] = useState(farmer.mobile || "");
  const [otp, setOtp] = useState("");
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [authError, setAuthError] = useState("");

  // Editable profile state
  const [name, setName] = useState(farmer.name || "");
  const [taluk, setTaluk] = useState(farmer.taluk || "Kanakapura");
  const [village, setVillage] = useState(farmer.village || "");
  const [farmArea, setFarmArea] = useState(farmer.farmArea || "");
  const [soilType, setSoilType] = useState(farmer.soilType || "Red sandy loam");
  const [waterSource, setWaterSource] = useState(farmer.waterSource || "Rainfed");

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const cleanPhone = mobile.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setAuthError(t.auth.invalidPhone);
      return;
    }
    setStep("otp");
    toast.info(`${t.auth.otpSentMsg} ${cleanPhone} (Demo OTP: 123456)`);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (otp.trim().length < 4) {
      setAuthError(t.auth.invalidOtp);
      return;
    }
    login(mobile, name || (lang === "kn" ? "ರೈತ ಬಂಧು" : "Farmer"));
    toast.success(lang === "kn" ? "ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದೆ!" : "Logged in successfully!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const cleanPhone = regMobile.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setAuthError(t.auth.invalidPhone);
      return;
    }
    if (!regName.trim()) {
      setAuthError(lang === "kn" ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ." : "Please enter your name.");
      return;
    }
    login(cleanPhone, regName.trim());
    toast.success(lang === "kn" ? "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Registered successfully!");
  };

  const saveFarmProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      taluk,
      village,
      farmArea,
      soilType,
      waterSource,
      preferredLang: lang,
    });
    toast.success(t.auth.profileSaved);
  };

  // If farmer is logged in, show Profile and Saved Data
  if (farmer.isLoggedIn) {
    const selectedTalukData = REGIONAL_LOCATIONS.find((loc) => loc.taluk === taluk);

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title={t.auth.title}
          subtitle={lang === "kn" ? "ನಿಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಜಮೀನಿನ ಮಾಹಿತಿ" : "Your farm details and saved recommendations"}
          icon={<User />}
        >
          <button
            type="button"
            onClick={() => {
              logout();
              toast.info(lang === "kn" ? "ಲಾಗ್ ಔಟ್ ಆಗಿದೆ." : "Logged out.");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>{t.auth.logoutBtn}</span>
          </button>
        </PageHeader>

        {/* Demo Mode Persistence Notice */}
        <Notice tone="info">
          <div className="text-xs sm:text-sm">
            <b>{lang === "kn" ? "ಸ್ಥಳೀಯ ಸಂಗ್ರಹಣೆ (ಡೆಮೊ ಆವೃತ್ತಿ):" : "Local Demo Storage:"}</b>{" "}
            {lang === "kn"
              ? "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ. ಮುಂಬರುವ ಪೈಥಾನ್ ಬ್ಯಾಕೆಂಡ್ ಮತ್ತು ಡಾಟಾಬೇಸ್‌ಗೆ ಸುಲಭವಾಗಿ ಸಂಪರ್ಕಿಸಬಹುದು."
              : "Your profile and saved crops are preserved locally in this browser. Frontend is structured ready to connect to a secure Python backend and database."}
          </div>
        </Notice>

        {/* Farmer Information & Farm Details Form */}
        <form onSubmit={saveFarmProfile} className="space-y-5">
          <Panel
            title={lang === "kn" ? "ರೈತರ ಮತ್ತು ಜಮೀನಿನ ವಿವರಗಳು" : "Farmer & Farm Information"}
            action={<DemoBadge label={t.common.demoBadge} />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.auth.farmerName}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "kn" ? "ಉದಾ: ಸೋಮಶೇಖರ್" : "e.g., Somashekar"}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.auth.mobileLabel}
                </label>
                <div className="flex items-center rounded-lg border border-input bg-muted/50 px-3 py-2.5 text-base text-muted-foreground">
                  <span className="font-semibold mr-2">+91</span>
                  <span>{farmer.mobile}</span>
                  <span className="ml-auto text-xs text-primary font-semibold">
                    ✓ {lang === "kn" ? "ದೃಢೀಕರಿಸಲಾಗಿದೆ" : "Verified"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.recommend.talukLabel}
                </label>
                <select
                  value={taluk}
                  onChange={(e) => {
                    setTaluk(e.target.value);
                    setVillage("");
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
                  {t.recommend.villageLabel}
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className={inputCls}
                >
                  <option value="">{lang === "kn" ? "ಗ್ರಾಮ ಆಯ್ಕೆಮಾಡಿ" : "Select village / locality"}</option>
                  {selectedTalukData?.villages.map((v) => (
                    <option key={v.en} value={v.en}>
                      {v.en} ({v.kn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.recommend.soilTypeLabel}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className={inputCls}
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s.en} value={s.en}>
                      {lang === "kn" ? s.kn : s.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.auth.farmArea}
                </label>
                <input
                  inputMode="decimal"
                  value={farmArea}
                  onChange={(e) => setFarmArea(e.target.value)}
                  placeholder={lang === "kn" ? "ಉದಾ: 2.5" : "e.g., 2.5"}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.auth.waterSource}
                </label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className={inputCls}
                >
                  <option value="Rainfed">{lang === "kn" ? "ಮಳೆಯಾಶ್ರಿತ (Rainfed)" : "Rainfed"}</option>
                  <option value="Borewell">{lang === "kn" ? "ಬೋರ್‌ವೆಲ್ (Borewell)" : "Borewell"}</option>
                  <option value="Drip Irrigation">{lang === "kn" ? "ಹನಿ ನೀರಾವರಿ (Drip Irrigation)" : "Drip Irrigation"}</option>
                  <option value="Tank / Canal">{lang === "kn" ? "ಕೆರೆ / ನಾಲೆ (Tank / Canal)" : "Tank / Canal"}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground">
                  {t.auth.preferredLang}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setLang("kn")}
                    className={`rounded-lg border py-2.5 text-sm font-semibold transition ${
                      lang === "kn" ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"
                    }`}
                  >
                    ಕನ್ನಡ (Kannada)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`rounded-lg border py-2.5 text-sm font-semibold transition ${
                      lang === "en" ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition"
              >
                <Save className="h-4 w-4" />
                <span>{t.auth.saveProfile}</span>
              </button>
            </div>
          </Panel>
        </form>

        {/* Previously Saved Recommendations */}
        <Panel
          title={
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <span>{t.nav.history} ({saved.length})</span>
            </div>
          }
        >
          {saved.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                {lang === "kn"
                  ? "ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆಗಳನ್ನು ಉಳಿಸಿಲ್ಲ."
                  : "No saved crop recommendations yet."}
              </p>
              <Link
                to="/recommend"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline"
              >
                <Sprout className="h-4 w-4" />
                <span>{t.nav.recommend}</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.map((s) => {
                const crop = getCrop(s.cropId);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl">{crop?.emoji || "🌱"}</span>
                      <div className="truncate">
                        <Link
                          to="/crops/$id"
                          params={{ id: s.cropId }}
                          className="font-bold text-base hover:text-primary transition"
                        >
                          {s.cropName} {s.cropKannada && <span className="font-normal text-muted-foreground">({s.cropKannada})</span>}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {s.location} • {s.season} • {lang === "kn" ? "ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್:" : "Match Score:"} {s.matchScore}%
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove saved crop"
                      onClick={() => setSaved(saved.filter((x) => x.id !== s.id))}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    );
  }

  // If NOT logged in, show Minimal Farmer Login & Registration Screen
  return (
    <div className="max-w-md mx-auto py-6 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.auth.backToHome}</span>
      </Link>

      <div className="text-center space-y-2">
        <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Sprout className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Raitha Bandhu (ರೈತ ಬಂಧು)
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === "register" ? t.auth.registerTitle : t.auth.subtitle}
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning-foreground flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <b>{lang === "kn" ? "ಡೆಮೊ ಲಾಗಿನ್:" : "Demo Login Mode:"}</b>{" "}
          {t.auth.demoNotice}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {step === "phone" && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold mb-1 text-foreground">
                {t.auth.mobileLabel}
              </label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm font-bold text-foreground">
                  +91
                </span>
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={t.auth.mobilePlaceholder}
                  className={`${inputCls} rounded-l-none`}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "kn" ? "ನಿಮ್ಮ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ." : "Enter your 10-digit Indian mobile number."}
              </p>
            </div>

            {authError && (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/95 transition"
            >
              {t.auth.sendOtp}
            </button>

            <div className="pt-2 text-center border-t border-border mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep("register");
                  setAuthError("");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t.auth.newFarmerPrompt}
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="rounded-lg bg-secondary/60 p-3 text-xs text-secondary-foreground flex items-center justify-between">
              <span>{t.auth.otpSentMsg} <b>+91 {mobile}</b></span>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setAuthError("");
                }}
                className="text-primary font-bold hover:underline"
              >
                {lang === "kn" ? "ಬದಲಾಯಿಸಿ" : "Change"}
              </button>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-semibold mb-1 text-foreground">
                {t.auth.enterOtp}
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className={`${inputCls} text-center text-2xl tracking-widest font-mono`}
                autoFocus
              />
              <p className="text-xs text-primary font-medium mt-1 text-center">
                💡 {t.auth.demoOtpHint}
              </p>
            </div>

            {authError && (
              <p role="alert" className="text-xs font-semibold text-destructive text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/95 transition"
            >
              {t.auth.verifyLogin}
            </button>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="hover:text-foreground"
              >
                {t.auth.changeMobile}
              </button>
              <button
                type="button"
                onClick={() => toast.info(`${t.auth.otpSentMsg} ${mobile} (Demo: 123456)`)}
                className="text-primary font-semibold hover:underline"
              >
                {t.auth.resendOtp}
              </button>
            </div>
          </form>
        )}

        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                {t.auth.farmerName}
              </label>
              <input
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={lang === "kn" ? "ಉದಾ: ಬಸವರಾಜು" : "e.g., Basavaraju"}
                className={inputCls}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                {t.auth.mobileLabel}
              </label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm font-bold text-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={t.auth.mobilePlaceholder}
                  className={`${inputCls} rounded-l-none`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">
                {t.auth.preferredLang}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setLang("kn")}
                  className={`rounded-lg border py-2.5 text-sm font-semibold transition ${
                    lang === "kn" ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"
                  }`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`rounded-lg border py-2.5 text-sm font-semibold transition ${
                    lang === "en" ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {authError && (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/95 transition"
            >
              {t.auth.registerBtn}
            </button>

            <div className="pt-2 text-center border-t border-border mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setAuthError("");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {lang === "kn" ? "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ" : "Already registered? Login"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
