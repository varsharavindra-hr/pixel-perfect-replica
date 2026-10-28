import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, Notice, DemoBadge, CropArt, inputCls } from "@/components/common";
import { CROPS, getCrop } from "@/lib/crops";
import { useCompare } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profit")({
  head: () => ({
    meta: [
      { title: "Cost & Profit Comparison | Raitha Bandhu (ರೈತ ಬಂಧು)" },
      { name: "description", content: "Compare cost, yield and estimated profit per acre for southern Karnataka crops." },
    ],
  }),
  component: ProfitPage,
});

export function profitPerAcre(cost: number, yieldQ: number, price: number) {
  return yieldQ * price - cost;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function ProfitPage() {
  const { lang, t } = useI18n();
  const [ids, setIds] = useCompare();

  // Regional defaults: Ragi, Togari, Maize
  const activeIds = ids.length ? ids : ["ragi", "togari", "maize"];
  const list = activeIds.map(getCrop).filter(Boolean) as typeof CROPS;

  const data = list.map((c) => ({
    name: lang === "kn" ? c.kannada.split(" ")[0] : c.name.split(" ")[0],
    Cost: c.costPerAcre,
    Income: c.yieldPerAcre * c.pricePerQuintal,
    Profit: profitPerAcre(c.costPerAcre, c.yieldPerAcre, c.pricePerQuintal),
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={t.nav.profit}
        subtitle={
          lang === "kn"
            ? "ಎಕರೆಗೆ ತಗಲುವ ಅಂದಾಜು ವೆಚ್ಚ, ಇಳುವರಿ ಮತ್ತು ಆದಾಯದ ಹೋಲಿಕೆ"
            : "Compare estimated cost, yield and net profit per acre for regional crops"
        }
        icon={<IndianRupee />}
      >
        <select
          aria-label="Add crop"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              setIds([...list.map((c) => c.id).filter((x) => x !== e.target.value), e.target.value].slice(-3));
            }
          }}
          className={`${inputCls} sm:w-56 text-xs`}
        >
          <option value="">{lang === "kn" ? "+ ಬೆಳೆ ಸೇರಿಸಿ" : "+ Add crop to compare"}</option>
          {CROPS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.kannada})
            </option>
          ))}
        </select>
      </PageHeader>

      {/* Cards per crop */}
      <div className="grid gap-4 sm:grid-cols-3">
        {list.map((c) => {
          const profit = profitPerAcre(c.costPerAcre, c.yieldPerAcre, c.pricePerQuintal);
          return (
            <div
              key={c.id}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3"
            >
              <button
                type="button"
                aria-label={`Remove ${c.name}`}
                onClick={() => setIds(list.map((x) => x.id).filter((x) => x !== c.id))}
                className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-muted transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 pr-6">
                <CropArt emoji={c.emoji} size="sm" />
                <div className="truncate">
                  <h2 className="text-base font-bold text-foreground truncate">
                    {c.name}
                  </h2>
                  <p className="text-xs font-semibold text-primary truncate">
                    {c.kannada}
                  </p>
                </div>
              </div>

              <dl className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">{lang === "kn" ? "ಅಂದಾಜು ವೆಚ್ಚ" : "Est. Cost"}</dt>
                  <dd className="font-semibold text-foreground">{inr(c.costPerAcre)}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">{lang === "kn" ? "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ" : "Exp. Yield"}</dt>
                  <dd className="font-semibold text-foreground">{c.yieldPerAcre} {t.common.quintal}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">{lang === "kn" ? "ಸರಾಸರಿ ದರ" : "Avg. Price"}</dt>
                  <dd className="font-semibold text-foreground">{inr(c.pricePerQuintal)}/qtl</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <dt className="text-muted-foreground">{lang === "kn" ? "ಬೆಳೆಯ ಅವಧಿ" : "Duration"}</dt>
                  <dd className="font-semibold text-foreground">{c.durationDays[1]} {t.common.days}</dd>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <dt className="text-foreground">{lang === "kn" ? "ಅಂದಾಜು ಲಾಭ" : "Est. Profit"}</dt>
                  <dd className={profit >= 0 ? "text-primary" : "text-destructive"}>
                    {inr(profit)}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <Panel
        title={lang === "kn" ? "ಎಕರೆವಾರು ವೆಚ್ಚ-ಆದಾಯ ಹೋಲಿಕೆ ಗ್ರಾಫ್" : "Per Acre Cost-Income Comparison"}
        action={<DemoBadge label={lang === "kn" ? "ಮಾದರಿ ಲೆಕ್ಕಾಚಾರ" : "Sample Estimates"} />}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
              <YAxis
                fontSize={11}
                tickFormatter={(v) => `₹${v / 1000}k`}
                stroke="var(--muted-foreground)"
              />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Legend />
              <Bar dataKey="Cost" name={lang === "kn" ? "ವೆಚ್ಚ (Cost)" : "Cost"} fill="var(--color-destructive)" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Income" name={lang === "kn" ? "ಒಟ್ಟು ಆದಾಯ (Income)" : "Income"} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit" name={lang === "kn" ? "ನಿವ್ವಳ ಲಾಭ (Profit)" : "Net Profit"} fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Notice tone="warn">
        <p className="text-xs">
          {lang === "kn"
            ? "ಗಮನಿಸಿ: ವೆಚ್ಚ ಮತ್ತು ಲಾಭದ ಅಂಕಿ-ಅಂಶಗಳು ಪ್ರಾದೇಶಿಕ ಮಾದರಿ ಅಂದಾಜುಗಳಾಗಿವೆ. ನೈಜ ಲಾಭವು ನಿಮ್ಮ ಕೂಲಿ ಖರ್ಚು, ಮಳೆ ಪ್ರಮಾಣ ಹಾಗೂ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆಯ ಮೇಲೆ ನಿರ್ಧಾರವಾಗುತ್ತದೆ."
            : "Notice: Costs and profits are regional sample estimates. Actual returns depend on your seed variety, labor costs, monsoon behavior, and prevailing APMC rates."}
        </p>
      </Notice>
    </div>
  );
}
