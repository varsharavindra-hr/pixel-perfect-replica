import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, ChevronDown, ExternalLink } from "lucide-react";
import { PageHeader, Notice } from "@/components/common";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/schemes")({
  head: () => seo("Government Schemes for Farmers", "Simple guide to PM-KISAN, PMFBY, Soil Health Card, KCC and more."),
  component: SchemesPage,
});

const SCHEMES = [
  { name: "PM-KISAN", tag: "Income support", what: "₹6,000 per year paid in 3 instalments to eligible farmer families.", who: "Landholding farmer families (some exclusions apply).", url: "https://pmkisan.gov.in" },
  { name: "PM Fasal Bima Yojana (PMFBY)", tag: "Crop insurance", what: "Low-premium insurance against crop loss from natural calamities, pests and disease.", who: "All farmers growing notified crops in notified areas.", url: "https://pmfby.gov.in" },
  { name: "Soil Health Card", tag: "Soil testing", what: "Free soil testing with crop-wise nutrient and fertilizer advice.", who: "All farmers.", url: "https://soilhealth.dac.gov.in" },
  { name: "Kisan Credit Card (KCC)", tag: "Credit", what: "Short-term crop loans at low interest with prompt repayment benefits.", who: "Farmers, tenant farmers, sharecroppers.", url: "https://www.myscheme.gov.in" },
  { name: "PM Krishi Sinchai Yojana (PMKSY)", tag: "Irrigation", what: "Subsidy for drip and sprinkler irrigation — 'Per Drop More Crop'.", who: "Farmers adopting micro-irrigation.", url: "https://pmksy.gov.in" },
  { name: "eNAM", tag: "Market", what: "Online national market to sell produce across mandis.", who: "Farmers registered with a linked mandi.", url: "https://enam.gov.in" },
];

function SchemesPage() {
  const [open, setOpen] = useState<string | null>(SCHEMES[0].name);
  return (
    <div className="space-y-5">
      <PageHeader title="Government Schemes" subtitle="Support available for farmers. Tap a scheme to learn more." icon={<Landmark />} />
      <div className="space-y-3">
        {SCHEMES.map((s) => {
          const isOpen = open === s.name;
          return (
            <div key={s.name} className="rounded-2xl border bg-card shadow-card">
              <button onClick={() => setOpen(isOpen ? null : s.name)} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-5 text-left">
                <div className="flex-1"><h2 className="text-lg font-semibold">{s.name}</h2><span className="text-xs font-semibold text-primary">{s.tag}</span></div>
                <ChevronDown className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="space-y-2 border-t px-5 py-4 text-sm">
                  <p><b>What you get:</b> {s.what}</p><p><b>Who can apply:</b> {s.who}</p>
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline">Official website <ExternalLink className="h-3 w-3" /></a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Notice>Scheme details change over time. Check the official website or your nearest Common Service Centre (CSC) for current rules.</Notice>
    </div>
  );
}
