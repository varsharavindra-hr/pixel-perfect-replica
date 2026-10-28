import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHeader, Notice, DemoBadge } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes for Farmers | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Key Karnataka state and central government agricultural schemes and subsidies." },
    ],
  }),
  component: SchemesPage,
});

interface SchemeItem {
  id: string;
  name: string;
  nameKn: string;
  tag: string;
  tagKn: string;
  what: string;
  whatKn: string;
  who: string;
  whoKn: string;
  url: string;
}

const REGIONAL_SCHEMES: SchemeItem[] = [
  {
    id: "raitha-siri",
    name: "Raitha Siri (Millet Incentive)",
    nameKn: "ರೈತ ಸಿರಿ ಯೋಜನೆ (ಸಿರಿಧಾನ್ಯ ಪ್ರೋತ್ಸಾಹ)",
    tag: "Karnataka State Scheme",
    tagKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಯೋಜನೆ",
    what: "Direct financial assistance of ₹10,000 per hectare for farmers growing millets like Ragi (Finger millet).",
    whatKn: "ರಾಗಿ ಸೇರಿದಂತೆ ಪ್ರಮುಖ ಸಿರಿಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯುವ ರೈತರಿಗೆ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000 ನೇರ ಆರ್ಥಿಕ ಪ್ರೋತ್ಸಾಹ ಧನ.",
    who: "Millet cultivating farmers in Karnataka registered in FRUITS portal.",
    whoKn: "ಫ್ರೂಟ್ಸ್ (FRUITS) ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತ ಕರ್ನಾಟಕದ ಸಿರಿಧಾನ್ಯ ಬೆಳೆಗಾರರು.",
    url: "https://fruits.karnataka.gov.in",
  },
  {
    id: "krishi-bhagya",
    name: "Krishi Bhagya (Farm Ponds)",
    nameKn: "ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ (ಕೃಷಿ ಹೊಂಡ)",
    tag: "Dryland Water Security",
    tagKn: "ಒಣಭೂಮಿ ನೀರಾವರಿ ಭದ್ರತೆ",
    what: "80% to 90% subsidy for digging Krishi Honda (farm pond), polythene lining, diesel pumpsets and shade nets.",
    whatKn: "ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣ, ಪಾಲಿಥೀನ್ ಹೊದಿಕೆ, ಡೀಸೆಲ್ ಪಂಪ್‌ಸೆಟ್ ಮತ್ತು ನೆರಳು ಪರದೆಗೆ ಶೇಕಡಾ 80 ರಿಂದ 90 ರವರೆಗೆ ಸಹಾಯಧನ.",
    who: "Rainfed farmers in dry agro-climatic zones like Ramanagara and Kanakapura.",
    whoKn: "ರಾಮನಗರ, ಕನಕಪುರ ಸೇರಿದಂತೆ ಮಳೆಯಾಶ್ರಿತ ಒಣ ವಲಯದ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು.",
    url: "https://raitamitra.karnataka.gov.in",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchayee Yojana (Drip Irrigation)",
    nameKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ (ಹನಿ ನೀರಾವರಿ)",
    tag: "Micro-Irrigation Subsidy",
    tagKn: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಸಹಾಯಧನ",
    what: "Up to 90% subsidy for SC/ST and up to 75% for general category farmers for installing drip and sprinkler systems.",
    whatKn: "ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಅಳವಡಿಕೆಗೆ ಪರಿಶಿಷ್ಟ ಜಾತಿ/ಪಂಗಡದವರಿಗೆ 90% ಹಾಗೂ ಸಾಮಾನ್ಯ ರೈತರಿಗೆ 75% ವರೆಗೆ ಸಬ್ಸಿಡಿ.",
    who: "Farmers with operational borewells or open wells seeking water conservation.",
    whoKn: "ಜಮೀನಿನಲ್ಲಿ ಬೋರ್‌ವೆಲ್ ಅಥವಾ ಬಾವಿ ಸೌಲಭ್ಯ ಹೊಂದಿರುವ ಎಲ್ಲಾ ವರ್ಗದ ರೈತರು.",
    url: "https://pmksy.gov.in",
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    nameKn: "ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
    tag: "Direct Income Support",
    tagKn: "ನೇರ ಆದಾಯ ಬೆಂಬಲ",
    what: "₹6,000 per year paid in three equal instalments of ₹2,000 directly into farmer bank accounts via Aadhaar DBT.",
    whatKn: "ವರ್ಷಕ್ಕೆ ₹6,000 ಮೊತ್ತವನ್ನು ತಲಾ ₹2,000 ದಂತೆ ಮೂರು ಕಂತುಗಳಲ್ಲಿ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಜಮೆ.",
    who: "All landholding farmer families with valid Aadhaar-linked land records.",
    whoKn: "ಆಧಾರ್ ಜೋಡಣೆಯಾದ ಪಹಣಿ (RTC) ಹೊಂದಿರುವ ಎಲ್ಲಾ ಅರ್ಹ ರೈತ ಕುಟುಂಬಗಳು.",
    url: "https://pmkisan.gov.in",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (Crop Insurance)",
    nameKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಬೆಳೆ ವಿಮೆ)",
    tag: "Calamity & Drought Cover",
    tagKn: "ಬರ ಮತ್ತು ನೈಸರ್ಗಿಕ ವಿಕೋಪ ವಿಮೆ",
    what: "Comprehensive risk coverage with subsidized farmer premiums (1.5% to 2% for food crops, 5% for horticultural crops).",
    whatKn: "ಬರ, ಪ್ರವಾಹ ಅಥವಾ ರೋಗಬಾಧೆಯಿಂದ ಬೆಳೆ ನಷ್ಟವಾದರೆ ಪರಿಹಾರ; ಕೇವಲ 1.5% ರಿಂದ 2% ರಷ್ಟು ಅತ್ಯಲ್ಪ ಪ್ರೀಮಿಯಂ.",
    who: "All farmers growing notified crops (Ragi, Maize, Groundnut, Tomato, etc.) in Ramanagara.",
    whoKn: "ರಾಮನಗರ ಜಿಲ್ಲೆಯಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳನ್ನು (ರಾಗಿ, ಜೋಳ, ಶೇಂಗಾ, ಇತ್ಯಾದಿ) ಬೆಳೆಯುವ ರೈತರು.",
    url: "https://samrakshane.karnataka.gov.in",
  },
  {
    id: "yashasvini",
    name: "Yashasvini Health Scheme",
    nameKn: "ಯಶಸ್ವಿನಿ ಸಹಕಾರಿ ಆರೋಗ್ಯ ಯೋಜನೆ",
    tag: "Healthcare for Farmers",
    tagKn: "ರೈತರಿಗೆ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸೆ",
    what: "Cashless surgical and medical treatments up to ₹5 lakh per family in empanelled hospitals across Karnataka.",
    whatKn: "ರಾಜ್ಯದ ನೋಂದಾಯಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ರೈತ ಕುಟುಂಬಕ್ಕೆ ₹5 ಲಕ್ಷದವರೆಗೆ ನಗದು ರಹಿತ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸೌಲಭ್ಯ.",
    who: "Members of Rural Cooperative Societies and Primary Agricultural Credit Societies (PACS).",
    whoKn: "ಗ್ರಾಮೀಣ ಸಹಕಾರ ಸಂಘಗಳು ಅಥವಾ ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘಗಳ (PACS) ಸದಸ್ಯರು.",
    url: "https://sahakara.kar.gov.in",
  },
];

function SchemesPage() {
  const { lang, t } = useI18n();
  const [openId, setOpenId] = useState<string | null>("raitha-siri");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.schemes}
        subtitle={
          lang === "kn"
            ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಕೃಷಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು"
            : "Guide to major Karnataka and Central agricultural schemes, subsidies and eligibility"
        }
        icon={<Landmark />}
      >
        <DemoBadge label={lang === "kn" ? "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" : "Government Schemes"} />
      </PageHeader>

      <div className="space-y-3">
        {REGIONAL_SCHEMES.map((s) => {
          const isOpen = openId === s.id;
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : s.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-5 text-left hover:bg-muted/30 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      {lang === "kn" ? s.nameKn : s.name}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {lang === "kn" ? s.tagKn : s.tag}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-border bg-muted/15 px-5 py-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-foreground">
                      {lang === "kn" ? "ಯೋಜನೆಯ ಪ್ರಯೋಜನ:" : "Benefits:"}{" "}
                    </span>
                    <span className="text-foreground/90 leading-relaxed">
                      {lang === "kn" ? s.whatKn : s.what}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-foreground">
                      {lang === "kn" ? "ಅರ್ಹತೆ:" : "Eligibility:"}{" "}
                    </span>
                    <span className="text-foreground/90 leading-relaxed">
                      {lang === "kn" ? s.whoKn : s.who}
                    </span>
                  </div>

                  <div className="pt-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline text-xs"
                    >
                      <span>{lang === "kn" ? "ಅಧಿಕೃತ ಜಾಲತಾಣಕ್ಕೆ ಭೇಟಿ ನೀಡಿ" : "Official Portal"}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ನಿಮ್ಮ ಹತ್ತಿರದ ಗ್ರಾಮ ಒನ್ (Grama One) ಅಥವಾ ಹಾರೋಹಳ್ಳಿ/ಕನಕಪುರದ 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ'ಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
            : "To apply for these schemes, visit your local Grama One center or the Raitha Samparka Kendra in Harohalli / Kanakapura with your RTC (Pahani) and Aadhaar card."}
        </p>
      </Notice>
    </div>
  );
}
