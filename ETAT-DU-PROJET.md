# État du projet — Site Groupe ATC

> **À lire en premier dans toute nouvelle session.** Ce fichier résume où en est
> le site, comment il est construit, ce qui reste à faire et comment travailler
> avec le propriétaire du projet. Les règles complètes sont dans `CLAUDE.md`
> (elles font foi), le détail des animations dans `MOTION.md`.
>
> Dernière mise à jour : 18 octobre 2026 (Kordian, logos, politique QSE V3).

---

## 1. En une minute

- Refonte du site WordPress de Groupe ATC en **HTML / CSS / JavaScript vanilla**,
  sans framework ; seules dépendances : GSAP et Three.js (copiés dans
  `js/vendor/`, sans build).
- **Les 30 pages sont construites**, en ligne localement, contrôlées :
  aucun lien ou image cassé, pas de débordement horizontal de 320 à 1920 px,
  pas de violation d'accessibilité (axe, WCAG 2.2 AA) sur les pages vérifiées.
- Le travail en cours : **revoir les pages projets une par une** pour les rendre
  plus fortes. Faits : DIO, Syama (Mine d'or), Zouerate, Centrale
  photovoltaïque, Centrale thermique, Fabrication de réservoirs
  (`projet-kordian`). **Reste : Sadiola.**
- Rien n'est mis en ligne. Le propriétaire **commite lui-même** : ne jamais
  commiter sans demande explicite.

## 2. Lancer le site en local

Le site utilise des chemins absolus depuis la racine (`/css/…`, `/contacts/`) :
il doit être servi par un serveur, pas ouvert en `file://`.

```bash
npx live-server --port=8000      # ou : python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/`.

## 3. Structure

Chaque page est à son **adresse historique WordPress**, sous la forme
`<slug>/index.html` : la barre d'adresse affiche `groupeatc.com/nos-projets/`,
sans `index.html`, et les anciennes URL fonctionnent sans redirection.

```text
index.html                 → /
404.html
nos-projets/               catalogue des projets
dio/ syama/ projet-thermique/ centrale-photovoltaique/
projet-kordian/ sadiola/ centrale-30mw-zouerate-mauritanie-2/   fiches projets
etude-de-projet/ travaux-miniers/ centrale-solaire/ construction/
chaudronerie-depot-petroliers/ construction-industrielle/
electricite-instrumentation/ genie-civil/ tuyauterie/ irrigation-reseaux/
amenagement-de-containers/ logistique-et-fourniture/ maintenance-industrielle/
nos-valeurs/ securite/ valeurs-humaines/ qualite/
offres-demploi/ contacts/ nos-agences/

assets/   images (par page : assets/images/projets/<projet>/…), logos, icônes
css/      variables, base, layout, components (design system), pages/<page>.css
js/       main.js (commun) + pages/<page>.js
data/     projects.js, agencies.js, activities.js, clients.js, jobs.js, site.js
tools/    build-partials.py, compose-galleries.py
```

### Outils à connaître

- **En-tête et pied de page** : générés depuis un modèle unique.
  Après toute modification de la navigation, du footer, ou l'ajout d'une page
  (à déclarer dans `PAGES`) :
  `python3 tools/build-partials.py`
- **Galeries composées** (agencement automatique sans trou selon l'orientation
  et la définition des photos) : relancer après ajout de photos à une galerie :
  `python3 tools/compose-galleries.py` (lent : plusieurs minutes, le lancer en
  arrière-plan). La galerie de Syama est exclue (grille dédiée `syama-gallery`).
- **Images** : toujours fournir un WebP (`cwebp`) et, pour les grandes photos,
  une version mobile `-960.webp` avec `<source media="(max-width: 767px)">`.

### Conventions

- Couleurs : bleu `#00235A`, orange officiel `#E45204` pour les traits, points
  et accents. Pour le **texte et les boutons**, utiliser les jetons accessibles :
  `--color-accent-700` (#C24503) sur fond clair, `--color-accent-on-dark`
  (#F06A1E) sur fond bleu.
- Polices : SciFly (titres, menus), Futura (texte).
- Composants partagés à réutiliser avant d'en créer : `.project-overview`
  (rangée texte + fiche technique des projets, dans `projets.css`),
  `.datasheet`, `.scene-caption`, `.hud-chip`, `.hud-dot`, `.btn`, galeries.
- Animations : `transform`, `opacity`, `clip-path`, `stroke-dashoffset` ;
  révélation via `.js-reveal` → `.is-revealed` (`js/animations.js`) ;
  toujours respecter `prefers-reduced-motion`.
- Toute donnée incertaine : commentaire `TODO: VALIDATION MÉTIER`, jamais
  d'invention.
- **Bibliothèques d'animation (décision du propriétaire, 18 octobre 2026)** :
  GSAP 3.15 (+ ScrollTrigger, SplitText, DrawSVG) et Three.js r186 sont
  installés localement dans `js/vendor/` (mode d'emploi et règles :
  `js/vendor/README.md`). À importer seulement dans les scripts de page ;
  Three.js (189 Ko compressé) chargé à la demande, avec image de repli.

## 4. Ce qui a été fait (résumé)

Le détail page par page est dans `MOTION.md`.

- **Global** : favicon et icônes, en-tête refait (logo SVG, barre d'infos qui
  disparaît au défilement), transition entre pages « du plan au terrain »,
  réseau du groupe redessiné dans la carte du pied de page, URLs propres,
  images mobiles, contrastes AA, audit Lighthouse (ordinateur 95–100,
  mobile 84–92).
- **Accueil** : ouverture « le chantier sort du plan » (photo de l'usine
  minière, plan tracé puis loupe « Vue plan » au survol), chiffres clés avec
  descriptions, carte du réseau, processus étude → mise en service,
  réalisations, engagements QSE, fin avec l'heure en direct au siège de Bamako.
- **Activités (13 pages)** : scènes signatures sur Étude de projet (viseur),
  Construction (soudure), Électricité (mise sous tension), Travaux miniers
  (la nuit s'allume).
- **Projets revus** :
  - **DIO** (en cours) : rangée projet + fiche, « De la trémie aux silos »
    (essais de mise en service joués sur deux vraies photos), rôle de Groupe ATC
    en 3 étapes photo, résultats, témoignages des superviseurs.
  - **Syama / Mine d'or** (en cours) : vue de drone, méthode atelier → site,
    moyens de levage à l'échelle (grue 30 m / 48 m, gammes de grues),
    galerie portrait dédiée.
  - **Zouerate** (en cours) : rangée projet + fiche, carte réseau Mali →
    Mauritanie avec l'agence de Nouakchott, galerie du chantier.
  - **Centrale photovoltaïque** (terminé) : rangée projet + fiche, course du
    soleil sur les trackers (photo et texte côte à côte), chiffres « du sol au
    réseau » sur la chaîne d'énergie.
  - **Centrale thermique 100 MW** (terminé) : rangée projet + fiche, « métré du
    chantier » (10 lignes de travaux, photo liée au survol).
  - **Fabrication de réservoirs** (`projet-kordian`, en cours) : rangée projet +
    fiche, « Un réservoir, virole après virole » (réservoir en plan 3D
    Three.js + GSAP, repli SVG ; il se construit en 4 étapes à côté des vraies photos : étapes 1–2 de ce chantier,
    3–4 d'autres dépôts ATC, indiqué sur les photos), bande « Bases
    opérationnelles » (parc et levage), galerie des 7 photos source.
- **Accueil — en-tête en deux diapositives avec plan 3D** (toutes tailles ;
  sur téléphone le plan flotte au-dessus du texte) : chantier minier + charpente métallique 3D, puis dépôt de
  réservoirs en construction (`assets/images/hero/parc-reservoirs.*`,
  « Priorité2 » du dossier Chaudronnerie) + réservoir 3D. Modèles 3D communs dans `js/three/`
  (le réservoir est partagé avec Kordian). Le plan dessiné et la loupe
  « Vue plan » ne sont plus affichés (code conservé dans index.html /
  home.css, à supprimer si l'option est définitivement abandonnée). À valider : texte de la
  diapositive 2 (repris des pages Chaudronnerie / Kordian) et nom / lieu du
  chantier de la photo 2 (même site que Kordian ?).
- **Cartes de visite en ligne** : `/carte-de-visite/cyril-monneret/` et
  `/carte-de-visite/jean-philippe-kouame/` — page vierge, sans en-tête ni pied
  de page : uniquement la carte (image tirée des PDF de
  `assets/carteDeVisite/`), qui s'incline au survol ; téléphone, e-mail et
  site sont des zones cliquables posées sur la carte (positions en % dans le
  HTML). Hors menu, hors sitemap, `noindex`, hors `build-partials.py`.
  vCard et PDF prêts dans `assets/documents/cartes/` (non liés pour l'instant).
- **Accueil — « Du plan au réel »** (section « De l'étude à la mise en
  service ») : la charpente 3D raconte les 5 étapes, chacune prouvée par une
  vraie photo ATC (`assets/images/process/`). L'illustration SVG d'origine
  reste en repli (sans WebGL / animations réduites). Les trois scènes 3D de
  l'accueil (en-tête, étapes, fin) partagent `js/three/`.
- **Accueil — fin « l'ouvrage est en service »** : la charpente de l'en-tête
  revient terminée dans la bande de contact, éclairée selon l'heure réelle à
  Bamako (jour / nuit, projecteurs). Aperçu : `/?bamako=nuit` ou `/?bamako=jour`.
- **Accueil — le réseau en globe 3D** (Three.js + GSAP), **sur téléphone
  uniquement (< 768 px)** ; sur ordinateur et tablette, la carte de présence
  d'origine reste telle quelle (décision du propriétaire). Repli téléphone :
  la même carte (sans WebGL / animations réduites). Points
  des terres : `assets/data/world-dots.bin`, généré depuis Natural Earth
  1:110m (domaine public). Coordonnées des villes : `geo` dans
  `data/agencies.js` (Tunisie et Niger : capitale, faute de ville publiée).
- **Logos clients** (accueil) : les 28 logos fournis dans
  `assets/FichiersPourNewPlaquette/Logo clients` (recadrés, WebP 2×) dans
  `data/clients.js`. Les anciens PNG de `assets/images/clients/` ne sont plus
  utilisés.
- **Politique QSE** : remplacée par la version officielle PG-DIR-001 V3
  (9 janvier 2026) sur Qualité et Nos valeurs ; le cycle « Politique QSE » de
  la page Qualité reprend ses 4 axes stratégiques.
- **Autres pages** : valeurs (sceaux, constellation, cycle QSE, contrôle EPI),
  agences (atlas vivant), contacts, offres d'emploi (fiches de poste façon
  document technique, badge d'accès chantier pour la candidature spontanée), 404.

## 5. Prochaines étapes

1. **Revoir `sadiola`**, sur le même modèle : contenu tiré de
   `https://groupeatc.com/<slug>/`, rangée `.project-overview`, **un** moment
   fort lié au métier, galerie, sans rien de « gros ».
2. Préparer la mise en ligne dès que l'hébergement est connu : fichier serveur
   (`.htaccess` ou équivalent) pour compression, cache et page 404.
3. Brancher le **formulaire de contact** sur un vrai envoi (script serveur ou
   service type Formspree) : aujourd'hui il valide mais n'envoie rien.
4. Ajouter les aperçus de partage (Open Graph) et les données structurées
   `Organization`, avec les vraies coordonnées.
5. Tests sur vrais appareils (Safari iOS, Android en connexion lente) : jamais
   faits, seulement des captures en navigateur simulé.

## 6. En attente de l'entreprise (ne rien inventer)

- Chiffres clés de l'accueil : **+40 clients** et **+200 projets** non sourcés.
- Phrase « … avec un maximum d'**input** local » : reformulation à valider.
- Nom et lieu du projet de la photo d'ouverture de l'accueil.
- Localisation (et client) de la **Mine d'or (Syama)** et du projet **Kordian**.
- Accord des clients pour publier leurs logos ; 15 logos encore en basse
  définition (liste dans `data/clients.js`).
- **DIO** : la section Résultats affiche « Mise en service réussie et
  opérationnelle » alors que le projet est **en cours** — à confirmer.
- **Sadiola** : texte et vraies photos (les photos actuelles de réservoirs,
  dans `assets/images/projets/mines/`, ne sont pas confirmées pour Sadiola).
- Centrale thermique : mention source « Centrale solaire de Sirakoro »
  incohérente, non reprise.
- Centrale photovoltaïque : « transformateurs ELTAS 11 KW / 5 KW » (unité à
  confirmer, kV ou MVA ?).
- Offres d'emploi de 2023 toujours ouvertes ? Adresse RH unique
  `rh.mali@groupeatc.com` valable pour les 9 pays ?
- Agence **Côte d'Ivoire** : affiche `niger@groupeatc.com` (erreur probable).
- Catalogue PDF de la Guinée, licence des polices.
- Ville de l'agence de **Tunisie** (« Imm Nour City ») et adresse du **Niger** :
  le globe les place sur la capitale en attendant.
- Accessibilité de la carte plate (agences, et accueil en repli) : repères
  d'Afrique de l'Ouest trop serrés (WCAG 2.5.8 `target-size`).
- Photos originales lourdes déplacées hors de `assets/` : le propriétaire
  garde ses propres copies.
- `assets/FichiersPourNewPlaquette/` (103 Mo de photos originales, logos,
  PDF) : source à exploiter pour les pages Chaudronnerie, Tuyauterie, Levage,
  Électricité, Solaire, Génie civil… **À sortir de `assets/` avant la mise en
  ligne** (seules les versions optimisées doivent être publiées).

## 7. Comment travailler avec le propriétaire

- Il écrit en français, souvent en abrégé ; répondre en français.
- Il veut du **« waou »** mais **jamais « gros gros »** : blocs compacts, sur de
  **vraies photos ATC**, une courte animation qui raconte puis une interaction.
  Pas de carrousels, pas d'effets gratuits, pas de « look IA ».
- Il n'aime pas les dates qui laissent croire qu'un chantier se limite à une
  période (le time-lapse daté de Zouerate a été retiré).
- Tout est « Groupe ATC » : ne pas attribuer le travail à ProEng ou SAF.
- Il ajoute souvent des photos dans `assets/images/…` en cours de route :
  vérifier les nouveaux fichiers (`ls -lt`) avant de travailler une page.
- Toujours vérifier visuellement (captures 1440 px et 390 px), lancer un contrôle
  des liens / images et un audit axe avant de rendre la main.
