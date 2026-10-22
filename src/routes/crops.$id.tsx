import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CropArt, Panel, Notice } from "@/components/common";
import { getCrop } from "@/lib/crops";

export const Route = createFileRoute("/crops/$id")({
  loader: ({ params }) => {
    const crop = getCrop(params.id);
    if (!crop) throw notFound();
    return { crop };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.crop.name} – Crop Guide | KhetMitra` },
          { name: "description", content: loaderData.crop.description },
          { property: "og:title", content: `${loaderData.crop.name} – Crop Guide` },
          { property: "og:description", content: loaderData.crop.description },
        ]
      : [{ title: "Crop not found – KhetMitra" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <p>Crop not found. <Link to="/crops" className="text-primary underline">Back to explorer</Link></p>,
  component: CropDetail,
});

function CropDetail() {
  const { crop: c } = Route.useLoaderData();
  const rows = [
    ["Seasons", c.seasons.join(", ")], ["Water need", c.water], ["Duration", `${c.durationDays[0]}–${c.durationDays[1]} days`],
    ["Temperature", `${c.temp[0]}–${c.temp[1]} °C`], ["Rainfall", `${c.rainfall[0]}–${c.rainfall[1]} mm`], ["Soil pH", `${c.ph[0]}–${c.ph[1]}`],
    ["Humidity", `${c.humidity[0]}–${c.humidity[1]} %`], ["Good soils", c.soils.join(", ")],
    ["N / P / K (kg/ha)", `${c.npk.n.join("–")} / ${c.npk.p.join("–")} / ${c.npk.k.join("–")}`],
  ];
  return (
    <div className="space-y-5">
      <Link to="/crops" className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />All crops</Link>
      <div className="flex items-center gap-4"><CropArt emoji={c.emoji} size="lg" />
        <div><h1 className="text-3xl font-semibold sm:text-4xl">{c.name}</h1><p className="text-muted-foreground">{c.hindi} · {c.type}</p></div>
      </div>
      <p className="text-lg">{c.description}</p>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Growing conditions">
          <dl className="divide-y">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}</dl>
        </Panel>
        <Panel title="How to grow">
          <ol className="space-y-3">{c.cultivation.map((s, i) => <li key={s} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>{s}</li>)}</ol>
        </Panel>
      </div>
      <Notice>Ranges are general guidance from sample data. Local varieties and conditions differ — ask your KVK for advice for your district.</Notice>
    </div>
  );
}
