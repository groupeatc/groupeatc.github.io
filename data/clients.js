// Centralized client / partner logos for the homepage band (js/pages/home.js).
//
// Source: the client logos supplied by Groupe ATC for the new brochure
// (assets/FichiersPourNewPlaquette/Logo clients, October 2026), margins
// trimmed and exported to WebP at 2× (max 320 × 160 px). Order: mining,
// energy, industry & services, institutions.
// TODO: VALIDATION MÉTIER — confirmer l'accord de chaque client pour la
// publication. Logos encore en basse définition dans le dossier fourni
// (fichiers de l'ancien site, 162 × 99 px) : B2Gold, Barrick, Endeavour,
// Somilo, Gounkoto, Resolute, Managem, Leo Lithium, Wärtsilä, Senstock, GAC,
// Bolloré, WBHO, BCM, Senet.
//
// Format : { name, logo, width, height } — `logo` relatif à la racine du site,
// width/height = dimensions réelles du fichier.
// Une entrée `placeholder: true` n'est affichée que si SHOW_PLACEHOLDERS vaut
// true ; sans aucune entrée affichable, le bandeau reste masqué.

export const SHOW_PLACEHOLDERS = false;

export const clients = [
  { name: "B2Gold", logo: "assets/images/clients/b2gold.webp", width: 162, height: 99 },
  { name: "Barrick", logo: "assets/images/clients/barrick.webp", width: 147, height: 76 },
  { name: "Endeavour Mining", logo: "assets/images/clients/endeavour-mining.webp", width: 132, height: 32 },
  { name: "Somilo — Mine de Loulo", logo: "assets/images/clients/somilo-loulo.webp", width: 142, height: 80 },
  { name: "Gounkoto Gold Mine", logo: "assets/images/clients/gounkoto.webp", width: 162, height: 99 },
  { name: "Resolute · Somisy", logo: "assets/images/clients/resolute-somisy.webp", width: 149, height: 69 },
  { name: "Managem", logo: "assets/images/clients/managem.webp", width: 158, height: 59 },
  { name: "Leo Lithium", logo: "assets/images/clients/leo-lithium.webp", width: 150, height: 61 },
  { name: "Lycopodium", logo: "assets/images/clients/lycopodium.webp", width: 232, height: 53 },
  { name: "SEMOS", logo: "assets/images/clients/semos.webp", width: 320, height: 81 },
  { name: "TotalEnergies", logo: "assets/images/clients/totalenergies.webp", width: 211, height: 154 },
  { name: "Vivo Energy", logo: "assets/images/clients/vivo-energy.webp", width: 200, height: 65 },
  { name: "OLA Energy", logo: "assets/images/clients/ola-energy.webp", width: 98, height: 68 },
  { name: "Senstock — Sénégalaise de stockage", logo: "assets/images/clients/senstock.webp", width: 119, height: 98 },
  { name: "Wärtsilä", logo: "assets/images/clients/wartsila.webp", width: 146, height: 91 },
  { name: "EDM-SA", logo: "assets/images/clients/edm.webp", width: 98, height: 160 },
  { name: "Africa Power Services", logo: "assets/images/clients/africa-power-services.webp", width: 320, height: 106 },
  { name: "Matelec", logo: "assets/images/clients/matelec.webp", width: 320, height: 84 },
  { name: "GIP Mauritanie", logo: "assets/images/clients/gip-mauritanie.webp", width: 216, height: 95 },
  { name: "Dornier Group", logo: "assets/images/clients/dornier-group.webp", width: 320, height: 85 },
  { name: "GAC — filiale d'EGA", logo: "assets/images/clients/gac.webp", width: 158, height: 53 },
  { name: "Diago", logo: "assets/images/clients/diago.webp", width: 282, height: 160 },
  { name: "Bolloré Logistics", logo: "assets/images/clients/bollore-logistics.webp", width: 136, height: 69 },
  { name: "Manutention Africaine Mali — CAT", logo: "assets/images/clients/manutention-africaine-cat.webp", width: 320, height: 81 },
  { name: "WBHO", logo: "assets/images/clients/wbho.webp", width: 138, height: 31 },
  { name: "BCM", logo: "assets/images/clients/bcm.webp", width: 152, height: 61 },
  { name: "Senet", logo: "assets/images/clients/senet.webp", width: 157, height: 28 },
  { name: "La Banque mondiale", logo: "assets/images/clients/banque-mondiale.webp", width: 320, height: 69 },
];
