export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} | Raitha Bandhu (ರೈತ ಬಂಧು)` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Raitha Bandhu (ರೈತ ಬಂಧು)` },
    { property: "og:description", content: description },
  ],
});
