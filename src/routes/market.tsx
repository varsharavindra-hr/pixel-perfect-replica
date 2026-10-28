import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Notice, DemoBadge, inputCls } from "@/components/common";
import { CROPS } from "@/lib/crops";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "APMC Market Prices | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Regional market prices for Kanakapura, Ramanagara and Bengaluru APMC mandis." },
    ],
  }),
  component: MarketPage,
});

const REGIONAL_MANDIS = [
  { en: "Kanakapura APMC", kn: "ಕನಕಪುರ ಎಪಿಎಂಸಿ" },
  { en: "Ramanagara Silk Market", kn: "ರಾಮನಗರ ರೇಷ್ಮೆ ಮಾರುಕಟ್ಟೆ" },
  { en: "Bengaluru (Yeshwanthpur)", kn: "ಬೆಂಗಳೂರು (ಯಶವಂತಪುರ)" },
  { en: "Channapatna Mandi", kn: "ಚನ್ನಪಟ್ಟಣ ಮಾರುಕಟ್ಟೆ" },
  { en: "Harohalli Shandy", kn: "ಹಾರೋಹಳ್ಳಿ ಸಂತೆ" },
];

const rows = CROPS.map((c, i) => {
  const mandiObj = REGIONAL_MANDIS[i % REGIONAL_MANDIS.length]!;
  return {
    c,
    mandi: mandiObj.en,
    mandiKn: mandiObj.kn,
    price: c.pricePerQuintal,
    change: ((i * 37) % 9) - 4,
  };
});

const generateTrend = (base: number) =>
  ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m, i) => ({
    m,
    price: Math.round(base * (0.92 + ((i * 11) % 8) / 50)),
  }));

function MarketPage() {
  const { lang, t } = useI18n();
  const [selectedCropId, setSelectedCropId] = useState("ragi");
  const selectedCrop = CROPS.find((x) => x.id === selectedCropId) ?? CROPS[0]!;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.market}
        subtitle={
          lang === "kn"
            ? "ಕನಕಪುರ, ರಾಮನಗರ ಮತ್ತು ಬೆಂಗಳೂರು ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆಗಳ ವಿವರ"
            : "Reference APMC commodity prices for Southern Bengaluru & Ramanagara"
        }
        icon={<TrendingUp />}
      >
        <DemoBadge label={lang === "kn" ? "ಮಾದರಿ ಧಾರಣೆ" : "Sample Mandi Rates"} />
      </PageHeader>

      {/* Today's Mandi Prices */}
      <Panel
        title={
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {lang === "kn"
                ? "ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು (ರೂ./ಕ್ವಿಂಟಾಲ್)"
                : "Today's Regional Mandi Rates (₹/quintal)"}
            </span>
          </div>
        }
      >
        <div className="divide-y divide-border">
          {rows.map(({ c, mandi, mandiKn, price, change }) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCropId(c.id)}
              className={`flex w-full items-center gap-3 py-3 text-left transition hover:bg-muted/30 px-2 rounded-xl ${
                selectedCropId === c.id ? "bg-secondary/60 text-foreground font-semibold" : ""
              }`}
            >
              <span className="text-3xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-foreground truncate">
                  {c.name} {c.kannada && <span className="font-normal text-muted-foreground">({c.kannada})</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {lang === "kn" ? mandiKn : mandi}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-base text-foreground">
                  ₹{price.toLocaleString("en-IN")}
                </div>
                <div
                  className={`flex items-center justify-end text-xs font-semibold ${
                    change >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(change)}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      {/* 6-Month Trend */}
      <Panel
        title={
          <div className="flex items-center gap-2">
            <span>{selectedCrop.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({lang === "kn" ? "6 ತಿಂಗಳ ದರ ಪ್ರವೃತ್ತಿ" : "6-Month Price Trend"})
            </span>
          </div>
        }
        action={
          <select
            aria-label="Crop"
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className={`${inputCls} w-44 py-1.5 text-xs`}
          >
            {CROPS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        }
      >
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateTrend(selectedCrop.pricePerQuintal)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="m" fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis fontSize={11} domain={["auto", "auto"]} stroke="var(--muted-foreground)" />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Line
                type="monotone"
                dataKey="price"
                name={lang === "kn" ? "ದರ (ರೂ.)" : "Price (₹)"}
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Notice tone="info">
        <p className="text-xs">
          {lang === "kn"
            ? "ಸೂಚನೆ: ಈ ದರಗಳು ಮಾದರಿ ಅಂಕಿ-ಅಂಶಗಳಾಗಿವೆ. ನೈಜ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳಿಗಾಗಿ ಕೇಂದ್ರ ಸರ್ಕಾರದ ಇ-ನ್ಯಾಮ್ (e-NAM) ಅಥವಾ ಕೃಷಿ ಇಲಾಖೆಯ ಅಗ್‌ಮಾರ್ಕ್‌ನೆಟ್ (Agmarknet) ತಾಣವನ್ನು ವೀಕ್ಷಿಸಿ."
            : "Notice: Prices shown are reference figures. For verified real-time rates, visit the official government e-NAM or Agmarknet portal."}
        </p>
      </Notice>
    </div>
  );
}
