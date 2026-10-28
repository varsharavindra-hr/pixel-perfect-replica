import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, HelpCircle } from "lucide-react";
import { PageHeader, DemoBadge, inputCls } from "@/components/common";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Farming Q&A Advisory | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Frequently asked agricultural questions for Southern Bengaluru and Ramanagara farmers." },
    ],
  }),
  component: AssistantPage,
});

type Message = { from: "user" | "bot"; text: string };

const REGIONAL_KNOWLEDGE_BASE: { regex: RegExp; ansEn: string; ansKn: string }[] = [
  {
    regex: /ragi|finger millet|ರಾಗಿ/i,
    ansEn: "Ragi should be sown during July–August with monsoon onset (varieties GPU-28, ML-365). Follow Akkadi Saalu (8:2 ratio with Togari) to replenish soil nitrogen.",
    ansKn: "ರಾಗಿಯನ್ನು ಮುಂಗಾರು ಆರಂಭದಲ್ಲಿ ಜುಲೈ-ಆಗಸ್ಟ್‌ನಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ (ತಳಿಗಳು: ಜಿಪಿಯು-28, ಎಂಎಲ್-365). ಮಣ್ಣಿನ ಫಲವತ್ತತೆಗೆ ತೊಗರಿಯೊಂದಿಗೆ ಅಕ್ಕಡಿ ಸಾಲು ಪದ್ಧತಿ (8:2) ಅನುಸರಿಸಿ.",
  },
  {
    regex: /sericulture|mulberry|silk|ರೇಷ್ಮೆ|ಹಿಪ್ಪುನೇರಳೆ/i,
    ansEn: "For mulberry sericulture in Ramanagara/Kanakapura, plant V-1 variety with paired rows. Prune every 55–60 days synchronized with silkworm rearing cycles.",
    ansKn: "ರಾಮನಗರ/ಕನಕಪುರ ಭಾಗದಲ್ಲಿ ರೇಷ್ಮೆ ಕೃಷಿಗೆ ಹೆಚ್ಚು ಸೊಪ್ಪು ಕೊಡುವ ವಿ-1 ತಳಿ ನಾಟಿ ಮಾಡಿ. ಹುಳು ಸಾಕಣೆಯ ಬ್ಯಾಚ್‌ಗೆ ತಕ್ಕಂತೆ ಪ್ರತಿ 55-60 ದಿನಗಳಿಗೊಮ್ಮೆ ಕೊಂಬೆ ಕಟಾವು ಮಾಡಿ.",
  },
  {
    regex: /tomato|ಟೊಮೇಟೊ/i,
    ansEn: "For tomatoes in Harohalli and Kanakapura, use IIHR hybrids (Arka Rakshak). Staking with bamboo poles prevents fruit rot, and yellow sticky traps control whiteflies.",
    ansKn: "ಹಾರೋಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರದಲ್ಲಿ ಟೊಮೇಟೊಗೆ ಅರ್ಕಾ ರಕ್ಷಕ್ ತಳಿ ಉತ್ತಮ. ಬಿದಿರಿನ ಆಸರೆ (ಸ್ಟೇಕಿಂಗ್) ಕಟ್ಟುವುದು ಮುಖ್ಯ ಮತ್ತು ಬಿಳಿ ನೊಣಕ್ಕೆ ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.",
  },
  {
    regex: /soil|red soil|ph|acid|ಸುಣ್ಣ|ಮಣ್ಣು/i,
    ansEn: "Zone 5 red soils are typically slightly acidic (pH 5.8–6.8). If pH drops below 5.5, apply agricultural lime @ 200 kg/acre. Always test your soil before applying bulk fertilizer.",
    ansKn: "ನಮ್ಮ ಭಾಗದ ಕೆಂಪು ಮಣ್ಣು ಸಾಮಾನ್ಯವಾಗಿ ಸ್ವಲ್ಪ ಆಮ್ಲೀಯವಾಗಿರುತ್ತದೆ (pH 5.8-6.8). ಪಿ.ಎಚ್ 5.5 ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದ್ದರೆ ಎಕರೆಗೆ 200 ಕೆಜಿ ಕೃಷಿ ಸುಣ್ಣ ಬಳಸಿ. ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ ಗೊಬ್ಬರ ಹಾಕಿ.",
  },
  {
    regex: /water|drip|irrigation|ನೀರಾವರಿ|ಹನಿ ನೀರಾವರಿ|ಬೋರ್‌ವೆಲ್/i,
    ansEn: "Drip irrigation saves 40–50% water in Kanakapura's red soils. Subsidies up to 75–90% are available under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) via Raitha Samparka Kendras.",
    ansKn: "ಕನಕಪುರದ ಕೆಂಪು ಮಣ್ಣಿಗೆ ಹನಿ ನೀರಾವರಿಯಿಂದ 40-50% ನೀರು ಉಳಿತಾಯವಾಗುತ್ತದೆ. ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರಗಳ ಮೂಲಕ ಪ್ರಧಾನ ಮಂತ್ರಿ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆಯಡಿ ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ.",
  },
  {
    regex: /scheme|subsidy|ಯೋಜನೆ|ಸಬ್ಸಿಡಿ|ಕಿಸಾನ್/i,
    ansEn: "Key schemes in Karnataka: PM-KISAN (direct income support), Raitha Siri (₹10,000/ha for millets like Ragi), Krishi Bhagya (farm ponds/Krishi Hondas), and Yashasvini health scheme.",
    ansKn: "ಪ್ರಮುಖ ಯೋಜನೆಗಳು: ಪಿಎಂ-ಕಿಸಾನ್, ಸಿರಿಧಾನ್ಯ (ರಾಗಿ) ಬೆಳೆಗಾರರಿಗೆ 'ರೈತ ಸಿರಿ' (ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000), 'ಕೃಷಿ ಭಾಗ್ಯ' (ಕೃಷಿ ಹೊಂಡ), ಮತ್ತು ಯಶಸ್ವಿನಿ ಆರೋಗ್ಯ ಯೋಜನೆ.",
  },
  {
    regex: /pest|disease|insect|ಕೀಟ|ರೋಗ|ಹುಳು/i,
    ansEn: "For eco-friendly pest management, spray neem oil (5 ml/litre) at first pest sighting. Install pheromone traps for Fall Armyworm in maize and fruit borers in brinjal.",
    ansKn: "ಪರಿಸರಸ್ನೇಹಿ ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕೆ ಕೀಟ ಕಂಡ ತಕ್ಷಣ 5 ಮಿ.ಲೀ ಬೇವಿನೆಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ಜೋಳದ ಸೈನಿಕ ಹುಳು ಹಾಗೂ ಬದನೆಕಾಯಿ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಲಿಂಗಾಕರ್ಷಕ ಬಲೆಗಳನ್ನು ಬಳಸಿ.",
  },
];

function getRegionalAnswer(q: string, lang: "kn" | "en") {
  const match = REGIONAL_KNOWLEDGE_BASE.find((k) => k.regex.test(q));
  if (match) {
    return lang === "kn" ? match.ansKn : match.ansEn;
  }
  return lang === "kn"
    ? "ಕ್ಷಮಿಸಿ, ಈ ಪ್ರಶ್ನೆಗೆ ಸದ್ಯಕ್ಕೆ ಉತ್ತರವಿಲ್ಲ. ರಾಗಿ, ರೇಷ್ಮೆ (ಹಿಪ್ಪುನೇರಳೆ), ಟೊಮೇಟೊ, ಮಣ್ಣಿನ ಪಿ.ಎಚ್, ನೀರಾವರಿ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 ಗೆ ಉಚಿತ ಕರೆ ಮಾಡಿ."
    : "I do not have a regional answer for that query yet. Try asking about Ragi, Sericulture/Mulberry, Tomato, Soil pH, Drip irrigation, or Government schemes. For direct expert advice, call Kisan Call Centre 1800-180-1551.";
}

function AssistantPage() {
  const { lang, t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text:
        lang === "kn"
          ? "ನಮಸ್ಕಾರ! ಹಾರೋಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರ ಭಾಗದ ಕೃಷಿ ಬೆಳೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ."
          : "Namaskara! Ask practical questions about crops, soil and farming in Southern Bengaluru.",
    },
  ]);
  const [text, setText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = lang === "kn"
    ? [
        "ರಾಗಿ ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?",
        "ಹಿಪ್ಪುನೇರಳೆ ರೇಷ್ಮೆ ಕೃಷಿ ಹೇಗೆ?",
        "ಟೊಮೇಟೊ ರೋಗ ನಿಯಂತ್ರಣ ಹೇಗೆ?",
        "ರಾಗಿ ಬೆಳೆಗಾರರಿಗೆ ಯಾವ ಯೋಜನೆ ಇದೆ?",
      ]
    : [
        "When to sow Ragi in Kanakapura?",
        "Mulberry sericulture practices?",
        "How to manage Tomato pests?",
        "Subsidies for millet farmers?",
      ];

  const handleAsk = (query: string) => {
    if (!query.trim()) return;
    const answer = getRegionalAnswer(query, lang);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: query },
      { from: "bot", text: answer },
    ]);
    setText("");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={t.nav.assistant}
        subtitle={
          lang === "kn"
            ? "ಸ್ಥಳೀಯ ಕೃಷಿ ಪದ್ಧತಿಗಳು ಮತ್ತು ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತ್ವರಿತ ಪ್ರಶ್ನೋತ್ತರ"
            : "Practical answers for Southern Bengaluru & Ramanagara farming queries"
        }
        icon={<MessageCircle />}
      >
        <DemoBadge label={lang === "kn" ? "ಪೂರ್ವ-ಸಿದ್ಧಪಡಿಸಿದ ಸಲಹೆಗಳು" : "Regional Q&A Knowledge"} />
      </PageHeader>

      <div className="flex h-[65vh] flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Chat message history */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                m.from === "user"
                  ? "ml-auto bg-primary text-primary-foreground font-medium"
                  : "bg-secondary/70 text-foreground border border-border/50"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2.5 bg-muted/20">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleAsk(q)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:border-primary transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(text);
          }}
          className="flex gap-2 p-3 sm:p-4 border-t border-border bg-card"
        >
          <input
            aria-label="Your question"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              lang === "kn"
                ? "ರಾಗಿ, ರೇಷ್ಮೆ, ಗೊಬ್ಬರ, ನೀರಾವರಿ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ…"
                : "Ask about ragi, sericulture, tomato, fertilizers…"
            }
            className={`${inputCls} text-sm`}
          />
          <button
            type="submit"
            aria-label="Send"
            className="rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/95 transition flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <span>
          {lang === "kn"
            ? "ತಜ್ಞ ಕೃಷಿ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ನೇರ ಮಾತನಾಡಲು: ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 (ಟೋಲ್ ಫ್ರೀ)"
            : "Kisan Call Centre Toll-Free Helpline: 1800-180-1551 (Govt. of India)"}
        </span>
      </div>
    </div>
  );
}
