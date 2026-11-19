---
name: groupe-atc
description: Rebuild and maintain the Groupe ATC corporate website as a clean HTML5/CSS3/vanilla JavaScript site. Use this skill whenever working on Groupe ATC pages, components, navigation, activities, projects, values, agencies, jobs, contact forms, SEO, responsive design, migration from the legacy WordPress site, or visual modernization.
---

# Groupe ATC Skill

## Mission

Construire et maintenir la nouvelle version du site **Groupe ATC** sans dépendre du WordPress historique.

Source de référence :

```text
https://groupeatc.com/
```

Stack par défaut :

```text
HTML5
CSS3
Vanilla JavaScript
```

Ne pas ajouter React, Vue, Angular, jQuery, Bootstrap, Tailwind, Elementor ou autre dépendance sans demande explicite.

---

# 1. Avant de modifier une page

Toujours :

1. identifier la page demandée ;
2. vérifier son URL historique ;
3. vérifier son rôle dans la navigation ;
4. vérifier les contenus métier ;
5. vérifier les images/assets ;
6. vérifier les liens sortants ;
7. vérifier les liens entrants ;
8. respecter `CLAUDE.md`.

Si une information métier est ambiguë, ne pas inventer.

Utiliser :

```text
TODO: VALIDATION MÉTIER
```

---

# 2. Arborescence fonctionnelle

## Accueil

```text
/
```

Fichier :

```text
index.html
```

Sections :

```text
Header
Hero
À propos
Chiffres clés
Vidéo
Solutions
Savoir-faire
Clients
Projets
Message institutionnel
Contact
Certification
Réseaux sociaux
Agences
Footer
```

---

# 3. Activités

```text
pages/activites/
```

Pages :

```text
etude-de-projet.html
travaux-miniers.html
centrale-solaire.html
construction.html
chaudronerie-depot-petroliers.html
construction-industrielle.html
electricite-instrumentation.html
genie-civil.html
tuyauterie.html
irrigation-reseaux.html
amenagement-de-containers.html
logistique-et-fourniture.html
maintenance-industrielle.html
```

Navigation métier :

```text
Ingénierie
└── Etude de Projet

Travaux Miniers

Centrale solaire

Construction
├── Chaudronerie & Dépôt pétroliers
├── Construction Industrielle
├── Electricité & Instrumentation
├── Génie Civil
└── Tuyauterie

Irrigation réseaux
Aménagement de Containers
Logistique & Fournitures
Maintenance Industrielle
```

---

# 4. Projets

Catalogue :

```text
pages/projets/index.html
```

Détails :

```text
centrale-30mw-zouerate-mauritanie.html
projet-thermique.html
centrale-photovoltaique.html
dio.html
projet-kordian.html
syama.html
```

Correspondances :

```text
Centrale 30MW Zouerate – Mauritanie
→ /centrale-30mw-zouerate-mauritanie-2/

Centrale Thermique de 100 MW
→ /projet-thermique/

Centrale Photovoltaïque
→ /centrale-photovoltaique/

Cimenterie Atlas – DIO
→ /dio/

Fabrication de réservoirs de dépôt pétrolier
→ /projet-kordian/

Mine d'or
→ /syama/
```

---

# 5. Valeurs

```text
pages/valeurs/
├── index.html
├── securite.html
├── valeurs-humaines.html
└── qualite.html
```

Correspondances :

```text
Nos valeurs
→ /nos-valeurs/

Sécurité et Environnements
→ /securite/

Valeurs humaines
→ /valeurs-humaines/

Qualité
→ /qualite/
```

---

# 6. Pages fonctionnelles

```text
pages/offres-emploi.html
pages/contacts.html
pages/agences.html
404.html
```

Anciennes URLs :

```text
/offres-demploi/
/contacts/
/nos-agences/
```

---

# 7. Architecture CSS

Respecter cet ordre :

```text
reset.css
variables.css
base.css
layout.css
components.css
utilities.css
responsive.css
```

Puis styles page-specific :

```text
css/pages/
```

Ne pas créer une feuille CSS indépendante pour chaque petite section.

---

# 8. Architecture JavaScript

```text
js/
├── main.js
├── navigation.js
├── slider.js
├── counters.js
├── animations.js
├── gallery.js
├── filters.js
└── forms.js
```

Règles :

- JavaScript modulaire ;
- pas de globales inutiles ;
- pas de duplication ;
- pas de scripts inline ;
- utiliser `defer` ;
- utiliser `IntersectionObserver` pour les animations/reveals ;
- respecter `prefers-reduced-motion`.

---

# 9. Données centralisées

Utiliser :

```text
data/projects.js
data/activities.js
data/agencies.js
data/site.js
```

Pour les projets, préférer un modèle :

```js
{
  slug: "projet-kordian",
  title: "Fabrication de réservoirs de dépôt pétrolier",
  status: "En cours",
  location: "",
  description: "",
  images: []
}
```

Les champs inconnus restent vides ou sont marqués pour validation.

Ne pas inventer les données.

---

# 10. Design

Direction :

```text
premium
industriel
institutionnel
sobre
moderne
international
```

Priorité visuelle :

```text
images de projets
+
typographie forte
+
espaces généreux
+
grilles propres
+
micro-interactions
```

Éviter :

```text
animations excessives
glassmorphism
gradients gratuits
ombres lourdes
templates SaaS
carrousels inutiles
```

---

# 11. Header

Desktop :

- navigation principale ;
- dropdowns ;
- état actif ;
- focus clavier ;
- sticky si validé.

Mobile :

- hamburger ;
- drawer/menu ;
- sous-menus ;
- Escape pour fermer ;
- focus management ;
- `aria-expanded`.

---

# 12. Composants

Réutiliser :

```text
Header
Footer
Hero
Breadcrumb
SectionHeading
Button
ActivityCard
ProjectCard
ProjectStatus
ProjectGallery
StatCounter
ClientLogo
AgencyCard
ContactForm
JobCard
JobFilters
Certification
SocialLinks
```

Si un composant existe déjà, le réutiliser.

Ne pas créer une deuxième version du même composant sans raison.

---

# 13. Images

Avant d'ajouter une image :

1. vérifier qu'elle appartient au projet ou que sa licence est valide ;
2. optimiser ;
3. nommer proprement ;
4. ajouter `alt` ;
5. définir largeur/hauteur ;
6. lazy-load si non critique.

Structure :

```text
assets/images/
├── hero/
├── about/
├── activites/
├── projets/
├── agences/
├── certifications/
├── clients/
└── ui/
```

---

# 14. Projets : structure standard

Chaque projet détaillé doit pouvoir contenir :

```text
Hero
Titre
Statut
Localisation
Résumé
Contexte
Intervention du Groupe ATC
Données techniques
Résultats
Galerie
CTA contact
Projets similaires
```

Ne pas afficher une section vide.

---

# 15. Galerie

Fonctions :

- grille responsive ;
- lazy loading ;
- ouverture lightbox ;
- image suivante/précédente ;
- fermeture Escape ;
- focus correct ;
- `aria-label`.

---

# 16. Formulaire de contact

Champs :

```text
Nom & Prénom *
Nom de société *
E-mail *
Message
```

Le front-end doit :

- valider ;
- afficher les erreurs ;
- afficher loading ;
- bloquer double submit ;
- afficher succès/erreur ;
- être utilisable au clavier.

Le traitement réel doit être côté backend/API.

Ne jamais placer une clé secrète dans le JS.

---

# 17. Offres d'emploi

Filtres :

```text
Mots-clés
Localisation
Télétravail uniquement
```

Architecture :

```text
source données
    ↓
JS
    ↓
filtrage
    ↓
JobCard
```

Le système doit être facilement branchable sur une API ultérieure.

---

# 18. Agences

Données actuelles à intégrer uniquement après validation :

```text
Mali
Guinée
Burkina-Faso
Sénégal
Tunisie
France
Mauritanie
Niger
Côte d'Ivoire
```

Chaque agence peut utiliser :

```js
{
  country: "",
  address: "",
  phone: "",
  email: "",
  catalogue: ""
}
```

Ne pas inventer les coordonnées.

La donnée Côte d'Ivoire actuellement affichée avec `niger@groupeatc.com` doit être signalée pour validation avant publication.

---

# 19. SEO

Pour chaque page :

```html
<title>
<meta name="description">
<link rel="canonical">
```

Prévoir :

```text
Open Graph
sitemap.xml
robots.txt
favicon
manifest
breadcrumbs
structured data
```

Un seul H1 principal.

Les H2/H3 doivent suivre la hiérarchie logique.

---

# 20. Accessibilité

Minimum :

```text
WCAG 2.2 AA
```

Toujours :

- clavier ;
- focus visible ;
- labels ;
- contraste ;
- alt ;
- landmarks ;
- titres cohérents ;
- boutons natifs ;
- liens descriptifs ;
- réduction des animations.

---

# 21. Performance

Toujours :

```text
loading="lazy"
```

pour les images non critiques.

Préférer :

```text
WebP / AVIF
```

Limiter :

- fonts ;
- JS ;
- CSS ;
- vidéos autoplay ;
- bibliothèques externes.

Ne jamais charger une librairie pour une fonctionnalité de quelques lignes.

---

# 22. Compatibilité des URLs

Conserver les URLs historiques lorsque possible.

Si l'architecture locale utilise :

```text
pages/projets/projet-thermique.html
```

le serveur peut utiliser des réécritures pour conserver :

```text
/projet-thermique/
```

Une URL modifiée doit avoir une redirection 301.

---

# 23. Migration WordPress

Ne jamais copier :

```text
elementor-*
wp-*
jquery
classes générées
CSS compilé du thème
scripts de plugins
```

Recréer :

```text
structure
contenu
comportement
design
```

---

# 24. Vérification avant commit

Toujours vérifier :

```text
[ ] aucun lien cassé
[ ] aucun asset 404
[ ] aucun console.error
[ ] aucun console.warn inutile
[ ] mobile OK
[ ] desktop OK
[ ] clavier OK
[ ] formulaires OK
[ ] images alt
[ ] SEO de base
[ ] page title
[ ] H1
[ ] canonical
[ ] animations réduites
[ ] aucune donnée inventée
```

---

# 25. Règle de décision

Quand deux solutions sont possibles, choisir celle qui :

1. est la plus simple ;
2. est la plus accessible ;
3. est la plus performante ;
4. est la plus réutilisable ;
5. minimise les dépendances ;
6. respecte l'architecture existante.

Ne jamais choisir une technologie simplement parce qu'elle est à la mode.

---

# 26. Definition of Done

Une page Groupe ATC est terminée lorsque :

```text
✓ contenu métier intégré
✓ design cohérent avec le design system
✓ responsive
✓ accessible
✓ SEO-ready
✓ images optimisées
✓ interactions fonctionnelles
✓ aucun lien cassé
✓ aucune erreur console
✓ aucun plugin legacy
✓ aucune donnée inventée
✓ code maintenable
```



# 9. Brand / Design System — Groupe ATC

Le design system suivant est **obligatoire** pour toute interface Groupe ATC.

## Brand

```text
Primary: #00235A
Accent:  #E45204
```

Ces deux couleurs ne doivent pas être remplacées par des variantes arbitraires.

### Rôle du bleu

```text
#00235A
```

Utiliser pour :

- header ;
- footer ;
- backgrounds institutionnels ;
- navigation ;
- titres sur fond clair ;
- boutons primaires ;
- éléments structurants.

### Rôle de l'orange

```text
#E45204
```

Utiliser pour :

- CTA ;
- éléments actifs ;
- accents ;
- badges ;
- indicateurs ;
- highlights ;
- soulignements.

L'orange est un **accent**, pas la couleur dominante de l'interface.

---

# Typography

## Futura

Futura = police des contenus.

Utiliser pour :

```text
paragraphes
descriptions
labels
formulaires
métadonnées
texte courant
```

Variable :

```css
--font-body: "Futura", sans-serif;
```

## SciFly

SciFly = police de marque pour les éléments courts et structurants.

Utiliser pour :

```text
H1
H2
H3
H4
menu
navigation
titres
labels institutionnels
```

Variables :

```css
--font-heading: "SciFly", sans-serif;
--font-menu: "SciFly", sans-serif;
```

Ne pas utiliser SciFly pour de longs paragraphes.

Les fichiers de police doivent provenir d'une source légalement autorisée par Groupe ATC.

---

# Typographic scale

Base :

```text
H1 desktop : 56–72px
H1 mobile  : 36–46px

H2 desktop : 40–52px
H2 mobile  : 30–38px

H3 desktop : 28–36px
H3 mobile  : 24–30px

Body       : 16–18px
Small      : 13–14px
```

Préférer `clamp()` pour les grands titres.

Line-height :

```text
Titres : ~1.0–1.15
Body   : ~1.5–1.75
```

---

# Spacing

Utiliser une échelle cohérente :

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
```

Les grandes sections peuvent utiliser :

```css
padding-block: clamp(4rem, 8vw, 8rem);
```

---

# Layout

Container :

```text
max-width: 1440px
```

Le contenu textuel long doit rester lisible et ne pas occuper inutilement toute la largeur.

---

# Buttons

### Primary

```text
background: #E45204
color: #FFFFFF
```

### Secondary

```text
background: #00235A
color: #FFFFFF
```

### Outline

```text
border: #00235A
color: #00235A
```

Minimum recommandé :

```text
44px de hauteur
20–28px de padding horizontal
```

Toujours prévoir :

```text
hover
focus-visible
active
disabled
```

---

# Header

Le header doit être immédiatement identifiable comme Groupe ATC.

Desktop :

```text
logo + navigation SciFly + CTA éventuel
```

Mobile :

```text
logo + menu tactile + CTA si nécessaire
```

Le bleu domine.

L'orange sert à l'état actif ou au CTA.

---

# Hero

Hero recommandé :

```text
photo industrielle forte
+
overlay bleu si nécessaire
+
titre SciFly
+
texte Futura
+
CTA orange
```

Ne pas surcharger le hero.

---

# Section heading

Pattern recommandé :

```text
eyebrow
H2 SciFly
accent orange
description Futura
```

Utiliser ce pattern lorsque pertinent, pas automatiquement partout.

---

# Cards

Priorité :

```text
image
titre SciFly
description Futura
metadata
CTA
```

Hover discret :

```text
translateY(-4px)
```

ou léger zoom image.

Interdit :

```text
rotation
glow
néon
bounce excessif
```

---

# Project UI

Les projets sont une priorité de la marque.

Toujours rendre visibles autant que possible :

```text
titre
image
localisation
statut
```

Les statuts utilisent l'accent orange lorsque cela améliore la hiérarchie.

---

# Dark sections

Autorisé :

```text
background: #00235A
text: #FFFFFF
accent: #E45204
```

Préférer le bleu Groupe ATC au noir pur pour les grandes surfaces sombres.

---

# Accessibility

Contrôler les contrastes.

Ne pas sacrifier la lisibilité pour respecter une couleur.

Toujours :

```text
focus-visible
navigation clavier
labels
alt
contraste
```

Focus recommandé :

```css
:focus-visible {
  outline: 3px solid #E45204;
  outline-offset: 3px;
}
```

---

# Brand anti-patterns

Ne pas :

```text
changer les couleurs de marque
ajouter des couleurs fortes sans justification
utiliser SciFly dans les paragraphes
utiliser Futura comme police des menus
ajouter plusieurs fonts
utiliser glassmorphism
utiliser néons/glows
faire du style SaaS
surcharger en gradients
surcharger en animations
```

---

# CSS variables de référence

```css
:root {
  --color-primary: #00235A;
  --color-accent: #E45204;

  --color-white: #FFFFFF;
  --color-black: #111111;
  --color-gray-50: #F4F5F7;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;

  --font-body: "Futura", sans-serif;
  --font-heading: "SciFly", sans-serif;
  --font-menu: "SciFly", sans-serif;

  --container-max: 1440px;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --transition-fast: 160ms ease;
  --transition-base: 280ms ease;
  --transition-slow: 500ms ease;
}
```

Ces règles sont la référence avant toute décision esthétique locale.
