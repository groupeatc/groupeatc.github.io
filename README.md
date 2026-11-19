# Groupe ATC — Site

Refonte du site institutionnel Groupe ATC en HTML5 / CSS3 / JavaScript vanilla.


## Statut

Étape 1 — Architecture / fondations : ossature de dossiers et fichiers de base uniquement.
Aucun contenu métier, aucune donnée d'agence/projet, aucun design final n'a encore été intégré.

## Structure

Chaque page vit à son **adresse historique**,
sous la forme `<slug>/index.html` : la barre d'adresse affiche `groupeatc.com/nos-projets/`,
jamais `index.html`, et aucune redirection n'est nécessaire pour les anciennes URL.

```text
index.html                      → /
404.html
nos-projets/index.html          → /nos-projets/
dio/, syama/, projet-thermique/, centrale-photovoltaique/, projet-kordian/,
sadiola/, centrale-30mw-zouerate-mauritanie-2/      (fiches projets)
etude-de-projet/, travaux-miniers/, construction/, tuyauterie/, …  (13 activités)
nos-valeurs/, securite/, valeurs-humaines/, qualite/
offres-demploi/, contacts/, nos-agences/
assets/  css/  js/  data/  tools/
```

Tous les liens internes et les ressources sont en chemins absolus depuis la racine
(`/contacts/`, `/assets/…`, `/css/…`). Le site doit donc être servi depuis la racine d'un
domaine (ou d'un serveur local : `npx live-server --port=8000` ou
`python3 -m http.server`), pas ouvert en `file://`.

## TODO

- Contenu métier, images, design system, composants : à construire page par page.

## Design system

- **Tokens** : `css/variables.css` (couleurs de marque + nuances fonctionnelles, échelle typographique, espacements, rayons, ombres, motion, z-index). Ne jamais coder une couleur ou une taille en dur dans un composant.
- **Composants** : `css/components.css` — header/nav, boutons (`btn--primary|secondary|outline|outline-light`, tailles `--sm|--lg`, états `:disabled`, `.is-loading`), badges de statut (`badge--ongoing` / `badge--done`), titres de section, fil d'Ariane, `card`, `cta-band`, footer, lightbox, formulaires (`form-field`, `form-control`, `form-error`), alertes, `empty-state`.
- **Sections** : `css/layout.css` — `.section`, `.section--muted`, `.section--dark`.
- **Accessibilité couleur** : l'orange officiel `#E45204` reste la couleur des traits, points et accents graphiques ; les boutons, badges et textes orange sur fond clair utilisent `--color-accent-700` (#C24503, 5,1:1), les textes orange sur fond bleu `--color-accent-on-dark` (#F06A1E, 4,9:1).

### Header & footer partagés

Le header et le footer sont identiques sur toutes les pages. Ils sont générés depuis un modèle unique :

```bash
python3 tools/build-partials.py
```

À relancer après toute modification de la navigation ou du footer, et après l'ajout d'une page (créer `<slug>/index.html`, puis l'ajouter dans `PAGES` du script avec sa clé de navigation active).

### Galeries photo

Les galeries (`.gallery-grid`) sont composées automatiquement selon l'orientation et la résolution de chaque photo (grande case, case haute, case large), sans trou :

```bash
python3 tools/compose-galleries.py
```

À relancer après tout ajout ou retrait de photo dans une galerie (les attributs `width` / `height` des `<img>` doivent correspondre au fichier réel).
