export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} – KhetMitra` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} – KhetMitra` },
    { property: "og:description", content: description },
  ],
});
