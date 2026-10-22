import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Trash2 } from "lucide-react";
import { PageHeader, Panel, CropArt } from "@/components/common";
import { useSaved } from "@/lib/storage";
import { getCrop } from "@/lib/crops";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/history")({
  head: () => seo("Saved Recommendations & History", "View and manage the crop suggestions you saved on this device."),
  component: HistoryPage,
});

function HistoryPage() {
  const [saved, setSaved] = useSaved();
  return (
    <div>
      <PageHeader title="Saved & History" subtitle="Saved on this phone or computer only." icon={<Bookmark />}>
        {saved.length > 0 && <button onClick={() => confirm("Delete all saved items?") && setSaved([])} className="rounded-lg border px-4 py-2 text-sm font-semibold text-destructive">Clear all</button>}
      </PageHeader>
      {saved.length === 0 ? (
        <Panel><p className="text-muted-foreground">No saved recommendations yet. <Link to="/recommend" className="font-semibold text-primary underline">Get crop suggestions</Link> and tap Save.</p></Panel>
      ) : (
        <div className="space-y-3">
          {saved.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
              <CropArt emoji={getCrop(s.cropId)?.emoji ?? "🌱"} size="sm" />
              <div className="flex-1 min-w-0">
                <Link to="/crops/$id" params={{ id: s.cropId }} className="font-semibold hover:text-primary">{s.cropName}</Link>
                <div className="truncate text-sm text-muted-foreground">{s.season} · {s.location} · demo score {s.demoScore}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.savedAt).toLocaleString("en-IN")}</div>
              </div>
              <button aria-label={`Delete ${s.cropName}`} onClick={() => setSaved(saved.filter((x) => x.id !== s.id))} className="rounded-lg p-2 hover:bg-muted"><Trash2 className="h-5 w-5 text-destructive" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
