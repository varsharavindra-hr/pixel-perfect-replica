import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { PageHeader, DemoBadge, inputCls } from "@/components/common";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/assistant")({
  head: () => seo("Farming Assistant", "Ask simple farming questions and get quick demo answers."),
  component: AssistantPage,
});

type Msg = { from: "me" | "bot"; text: string };
const ANSWERS: [RegExp, string][] = [
  [/wheat|gehu/i, "Wheat is sown in November. Give the first irrigation about 21 days after sowing (crown root stage)."],
  [/rice|dhan|paddy/i, "Rice needs plenty of water. Transplant 20–25 day old seedlings and keep 2–5 cm water in the field."],
  [/ph|acid|alkal/i, "Most crops like soil pH 6–7.5. Lime helps acidic soil; gypsum helps alkaline soil. Test first!"],
  [/urea|fertili|khad|dap/i, "Split urea into 2–3 doses instead of one. Apply DAP at sowing. Follow your Soil Health Card."],
  [/pest|insect|keeda|worm/i, "Use pheromone and sticky traps first. Neem oil (5 ml per litre) works for many soft pests."],
  [/water|irrigat|drip/i, "Drip irrigation saves 30–50% water. Subsidy is available under PMKSY."],
  [/scheme|yojana|kisan/i, "Check PM-KISAN for income support and PMFBY for crop insurance. See the Schemes page."],
];
export function demoAnswer(q: string) {
  return ANSWERS.find(([r]) => r.test(q))?.[1] ?? "I don't have a demo answer for that yet. Try asking about wheat, rice, soil pH, fertilizer, pests, water or schemes. For expert help call Kisan Call Centre 1800-180-1551.";
}
const SUGGEST = ["When to sow wheat?", "How to fix acidic soil?", "How to control pests?", "Which scheme gives money?"];

function AssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Namaste! Ask me a farming question." }]);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);
  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: demoAnswer(q) }]);
    setText("");
  };
  return (
    <div>
      <PageHeader title="Farming Assistant" subtitle="Quick answers to common questions." icon={<MessageCircle />}><DemoBadge label="Pre-written demo answers" /></PageHeader>
      <div className="flex h-[60vh] flex-col rounded-2xl border bg-card shadow-card">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{m.text}</div>
          ))}
          <div ref={end} />
        </div>
        <div className="flex flex-wrap gap-2 border-t px-4 pt-3">
          {SUGGEST.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-full border px-3 py-1 text-sm hover:border-primary">{s}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex gap-2 p-4">
          <input aria-label="Your question" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" className={inputCls} />
          <button aria-label="Send" className="rounded-lg bg-primary px-4 text-primary-foreground"><Send className="h-5 w-5" /></button>
        </form>
      </div>
    </div>
  );
}
