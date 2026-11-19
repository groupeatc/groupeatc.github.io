// Centralized project data (see CLAUDE.md sections 6-7). Do not invent values —
// leave fields empty until confirmed against source content.
// `keyFigure` is shown on the project cards (index.html, pages/projets/index.html):
// keep both in sync with this file. Only figures published in the source.

export const projects = [
  {
    slug: "centrale-30mw-zouerate-mauritanie",
    title: "Centrale 30MW Zouerate – Mauritanie",
    status: "En cours",
    location: "Zouerate, Mauritanie",
    href: "/centrale-30mw-zouerate-mauritanie-2/",
  },
  {
    slug: "projet-thermique",
    title: "Centrale Thermique de 100 MW",
    status: "Terminé",
    location: "Bamako, Mali",
    href: "/projet-thermique/",
    keyFigure: { value: "18 290 m³", label: "12 réservoirs de stockage" },
  },
  {
    slug: "centrale-photovoltaique",
    title: "Centrale Photovoltaïque",
    status: "Terminé",
    location: "Mine de Somilo Loulo",
    href: "/centrale-photovoltaique/",
    keyFigure: { value: "72 MW", label: "3 centrales solaires" },
  },
  {
    slug: "dio",
    title: "Cimenterie Atlas – DIO",
    status: "En cours",
    location: "DIO, Cercle de Kati",
    href: "/dio/",
    keyFigure: { value: "400 000 t/an", label: "capacité de production" },
  },
  {
    slug: "projet-kordian",
    title: "Fabrication de réservoirs de dépôt pétrolier",
    status: "En cours",
    location: "", // TODO: VALIDATION MÉTIER — localisation non précisée dans la source actuelle.
    href: "/projet-kordian/",
  },
  {
    slug: "syama",
    title: "Mine d'or",
    status: "En cours",
    location: "", // TODO: VALIDATION MÉTIER — localisation non précisée dans la source actuelle.
    href: "/syama/",
  },
  {
    slug: "sadiola",
    title: "Sadiola",
    status: "Terminé",
    location: "", // TODO: VALIDATION MÉTIER — localisation non précisée dans la source actuelle (mine d'or de Sadiola, Mali).
    href: "/sadiola/",
  },
];
