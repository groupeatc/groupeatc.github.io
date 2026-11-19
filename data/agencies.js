// Centralized agencies data (see CLAUDE.md section 11). Do not invent coordinates.
// `position` (top/left, in %) locates each agency's marker over
// assets/images/about/presence-countries.png — taken from the real
// coordinates used on the live site's own hotspot map
// (groupeatc.com, image-map <area coords="x,y,r"> in image-pixel space,
// same 1536×1499 source image), converted to percentages. Not guessed.

// `timeZone` (IANA) gives each agency's live local time on the agences page —
// a geographic fact about the country, not company data.

// `geo` (lat/lon, rounded to 0.01°) places each agency on the home globe
// (js/globe.js): the public coordinates of the city named in its address, or
// of the capital when the address names no city (see each line). Indicative
// only — a globe marker, not a street location. `iso` = Natural Earth code,
// used to light the country's dots (assets/data/world-dots.bin).

export const agencies = [
  {
    country: "France",
    iso: "FRA",
    geo: { lat: 43.66, lon: 6.92 }, // Grasse (adresse)
    timeZone: "Europe/Paris",
    address: "56 Bd Belletrud, 06130 GRASSE",
    phone: "(+33) 6 50 70 13 53",
    email: "contact@safexport.fr",
    position: { top: "20.61%", left: "25.00%" },
  },
  {
    country: "Tunisie",
    iso: "TUN",
    geo: { lat: 36.81, lon: 10.18 }, // Tunis — ville non précisée dans l'adresse, capitale par défaut
    timeZone: "Africa/Tunis",
    address: "Imm Nour City",
    phone: "(+216) 56 501 927",
    email: "info@proeng.com",
    position: { top: "34.89%", left: "29.30%" },
  },
  {
    country: "Mali",
    iso: "MLI",
    geo: { lat: 12.6, lon: -7.93 }, // Niamana, Bamako (adresse)
    timeZone: "Africa/Bamako",
    address: "Niamana - Route de Ségou, Mali",
    phone: "+223 92 10 10 10",
    email: "mali@groupeatc.com",
    position: { top: "53.30%", left: "16.54%" },
    // Société mère : reliée au logo Groupe ATC et à chaque filiale sur la carte (js/network.js).
    isHub: true,
  },
  {
    country: "Burkina Faso",
    iso: "BFA",
    geo: { lat: 12.37, lon: -1.52 }, // Ouagadougou (Ouidi, adresse)
    timeZone: "Africa/Ouagadougou",
    address: "Rue Timbila Roger - secteur 44 Ouidi",
    phone: "(+226) 74 05 49 95",
    email: "burkina@groupeatc.com",
    position: { top: "54.37%", left: "20.18%" },
  },
  {
    country: "Guinée",
    iso: "GIN",
    geo: { lat: 9.73, lon: -13.42 }, // Manéah, route de Conakry (adresse)
    timeZone: "Africa/Conakry",
    address: "Route de Conakry - Manéah Km 43",
    phone: "(+224) 61 20 20 43",
    email: "guinee@groupeatc.com",
    // Catalogue published on the live site — TODO: héberger le PDF localement.
    catalogue: "https://groupeatc.com/wp-content/uploads/2023/11/ATC-Guinee_Catalogue_2022.pdf",
    position: { top: "56.50%", left: "12.76%" },
  },
  {
    country: "Sénégal",
    iso: "SEN",
    geo: { lat: 14.69, lon: -17.45 }, // Dakar (adresse)
    timeZone: "Africa/Dakar",
    address: "Dakar 79, Rue Joseph GOMIS",
    phone: "(+221) 77 496 45 38",
    email: "senegal@groupeatc.com",
    position: { top: "53.04%", left: "9.38%" },
  },
  {
    country: "Mauritanie",
    iso: "MRT",
    geo: { lat: 18.09, lon: -15.98 }, // Nouakchott (adresse)
    timeZone: "Africa/Nouakchott",
    address: "Tevragh Zeina, Nouakchott",
    // TODO: VALIDATION MÉTIER — aucun téléphone publié dans la source actuelle.
    phone: "",
    email: "mauritanie@groupeatc.com",
    position: { top: "49.17%", left: "8.59%" },
  },
  {
    country: "Niger",
    iso: "NER",
    geo: { lat: 13.51, lon: 2.11 }, // Niamey — aucune adresse publiée, capitale par défaut
    timeZone: "Africa/Niamey",
    // TODO: VALIDATION MÉTIER — aucune adresse détaillée publiée dans la source actuelle.
    address: "",
    phone: "",
    email: "niger@groupeatc.com",
    position: { top: "49.83%", left: "28.58%" },
  },
  {
    country: "Côte d'Ivoire",
    iso: "CIV",
    geo: { lat: 5.32, lon: -4.02 }, // Abidjan Plateau (adresse)
    timeZone: "Africa/Abidjan",
    address: "Abidjan Plateau, Boulevard de la République, Immeuble XL Building",
    phone: "",
    // Email intentionnellement omis : la source actuelle publie
    // "niger@groupeatc.com" pour la Côte d'Ivoire, ce qui semble être une
    // erreur de contenu (CLAUDE.md section 11) — TODO: VALIDATION MÉTIER.
    email: "",
    position: { top: "59.04%", left: "16.34%" },
  },
];
