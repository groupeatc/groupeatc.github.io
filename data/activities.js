// Centralized activities (domaine d'activités) data — see CLAUDE.md sections 4 & 13.
// `category` reflects the real nav grouping (Ingénierie / Construction) and is
// null for activities that sit directly under "Domaine d'activités" with no
// parent category — do not invent a grouping where the nav doesn't have one.

export const activities = [
  {
    slug: "etude-de-projet",
    title: "Étude de Projet",
    category: "Ingénierie",
    href: "/etude-de-projet/",
  },
  {
    slug: "travaux-miniers",
    title: "Travaux Miniers",
    category: null,
    href: "/travaux-miniers/",
  },
  {
    slug: "centrale-solaire",
    title: "Centrale solaire",
    category: null,
    href: "/centrale-solaire/",
  },
  {
    slug: "chaudronerie-depot-petroliers",
    title: "Chaudronnerie & Dépôt pétroliers",
    category: "Construction",
    href: "/chaudronerie-depot-petroliers/",
  },
  {
    slug: "construction-industrielle",
    title: "Construction Industrielle",
    category: "Construction",
    href: "/construction-industrielle/",
  },
  {
    slug: "electricite-instrumentation",
    title: "Électricité & Instrumentation",
    category: "Construction",
    href: "/electricite-instrumentation/",
  },
  {
    slug: "genie-civil",
    title: "Génie Civil",
    category: "Construction",
    href: "/genie-civil/",
  },
  {
    slug: "tuyauterie",
    title: "Tuyauterie",
    category: "Construction",
    href: "/tuyauterie/",
  },
  {
    slug: "irrigation-reseaux",
    title: "Irrigation réseaux",
    category: null,
    href: "/irrigation-reseaux/",
  },
  {
    slug: "amenagement-de-containers",
    title: "Aménagement de Containers",
    category: null,
    href: "/amenagement-de-containers/",
  },
  {
    slug: "logistique-et-fourniture",
    title: "Logistique & Fournitures",
    category: null,
    href: "/logistique-et-fourniture/",
  },
  {
    slug: "maintenance-industrielle",
    title: "Maintenance Industrielle",
    category: null,
    href: "/maintenance-industrielle/",
  },
];
