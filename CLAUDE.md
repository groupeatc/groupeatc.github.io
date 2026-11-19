# Groupe ATC — Claude Code Project Instructions

> **Projet :** refonte complète du site Groupe ATC
>
> **Objectif :** remplacer l'ancien site WordPress par un site front-end propre, performant, maintenable et fidèle à l'identité actuelle de Groupe ATC, tout en améliorant fortement l'UX, le responsive, l'accessibilité, le SEO et les performances.
>
> **Source de vérité actuelle :** https://groupeatc.com/
>
> **Stack cible :** HTML5 + CSS3 + JavaScript vanilla. Ne pas introduire de framework ou de page builder sans décision explicite du développeur.

> **Nouvelle session : lire d'abord `ETAT-DU-PROJET.md`** (état d'avancement, structure réelle des URLs, prochaines étapes, points en attente).

---

## 1. Mission générale

Tu travailles sur la reconstruction du site institutionnel de **Groupe ATC**.

Le nouveau site doit :

- conserver le contenu métier important du site actuel ;
- conserver les URLs publiques importantes autant que possible ;
- reproduire l'identité visuelle Groupe ATC sans reproduire les défauts de WordPress ;
- être plus moderne, premium, lisible et cohérent ;
- être parfaitement responsive ;
- être rapide ;
- être accessible ;
- être SEO-friendly ;
- être facilement maintenable par un développeur ;
- ne dépendre d'aucun plugin WordPress ;
- ne pas utiliser de code inutile ou de dépendances lourdes ;
- rester simple à déployer sur un hébergement statique ou classique.

**Principe fondamental : ne jamais transformer ce projet en copie du HTML généré par WordPress.**

On reconstruit le produit, pas le code source de l'ancien CMS.

---

# 2. Architecture cible

Structure recommandée :

```text
groupe-atc/
│
├── index.html
│
├── pages/
│   ├── activites/
│   │   ├── index.html
│   │   ├── etude-de-projet.html
│   │   ├── travaux-miniers.html
│   │   ├── centrale-solaire.html
│   │   ├── construction.html
│   │   ├── chaudronerie-depot-petroliers.html
│   │   ├── construction-industrielle.html
│   │   ├── electricite-instrumentation.html
│   │   ├── genie-civil.html
│   │   ├── tuyauterie.html
│   │   ├── irrigation-reseaux.html
│   │   ├── amenagement-de-containers.html
│   │   ├── logistique-et-fourniture.html
│   │   └── maintenance-industrielle.html
│   │
│   ├── projets/
│   │   ├── index.html
│   │   ├── centrale-30mw-zouerate-mauritanie.html
│   │   ├── projet-thermique.html
│   │   ├── centrale-photovoltaique.html
│   │   ├── dio.html
│   │   ├── projet-kordian.html
│   │   └── syama.html
│   │
│   ├── valeurs/
│   │   ├── index.html
│   │   ├── securite.html
│   │   ├── valeurs-humaines.html
│   │   └── qualite.html
│   │
│   ├── offres-emploi.html
│   ├── contacts.html
│   └── agences.html
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── activites/
│   │   ├── projets/
│   │   ├── agences/
│   │   ├── certifications/
│   │   ├── clients/
│   │   └── ui/
│   │
│   ├── icons/
│   ├── logos/
│   ├── videos/
│   └── documents/
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── utilities.css
│   ├── responsive.css
│   └── pages/
│       ├── home.css
│       ├── activites.css
│       ├── projets.css
│       ├── valeurs.css
│       ├── agences.css
│       ├── contact.css
│       └── emploi.css
│
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── slider.js
│   ├── counters.js
│   ├── animations.js
│   ├── gallery.js
│   ├── filters.js
│   ├── forms.js
│   └── pages/
│       ├── home.js
│       ├── projets.js
│       └── emploi.js
│
├── data/
│   ├── projects.js
│   ├── agencies.js
│   ├── activities.js
│   └── site.js
│
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── 404.html
├── favicon.ico
└── README.md
```

### Important

Si le déploiement doit reproduire exactement les anciennes URLs `/nos-projets/`, `/contacts/`, etc., préférer une structure de dossiers :

```text
nos-projets/
└── index.html
```

plutôt que :

```text
nos-projets.html
```

Les URLs historiques sont prioritaires sur les préférences personnelles de nommage.

---

# 3. Inventaire du site actuel

L'inventaire ci-dessous est basé sur la navigation et les pages actuellement accessibles sur le site Groupe ATC.

## 3.1 Accueil

Ancienne URL :

```text
/
```

Nouvelle page :

```text
/index.html
```

Sections à conserver/repenser :

1. Header principal
2. Navigation desktop
3. Navigation mobile
4. Hero / slider principal
5. Présentation du Groupe ATC
6. Chiffres clés
7. Vidéo de présentation
8. Solutions / domaines principaux
9. Savoir-faire
10. Clients / partenaires
11. Projets mis en avant
12. Message institutionnel
13. Formulaire de contact
14. Certification
15. Réseaux sociaux
16. Agences
17. Footer

Le site actuel présente notamment ATC comme une entreprise créée en 1998, historiquement spécialisée dans la construction métallique et désormais active dans plusieurs domaines EPC en Afrique.

Les chiffres actuellement affichés dans le WordPress doivent être **vérifiés avant migration** : certaines valeurs apparaissent actuellement comme `0` ou `+ 0`. Ne jamais recopier un chiffre cassé simplement parce qu'il apparaît dans l'ancien site.

---

# 4. Domaine d'activités

La navigation actuelle expose les catégories suivantes :

```text
DOMAINE D'ACTIVITÉS
│
├── Ingénierie
│   └── Etude de Projet
│
├── Travaux Miniers
│
├── Centrale solaire
│
├── Construction
│   ├── Chaudronerie & Dépôt pétroliers
│   ├── Construction Industrielle
│   ├── Electricité & Instrumentation
│   ├── Génie Civil
│   └── Tuyauterie
│
├── Irrigation réseaux
├── Aménagement de Containers
├── Logistique & Fournitures
└── Maintenance Industrielle
```

> Les entrées « Ingénierie » et « Construction » servent de catégories dans le menu. Si leur destination WordPress n'est pas une page autonome exploitable, ne pas inventer du contenu : utiliser une landing page de catégorie uniquement si le nouveau design en a besoin.

---

# 5. Pages Activités

## 5.1 Étude de Projet

Ancienne URL vérifiée :

```text
/etude-de-projet/
```

Fichier cible :

```text
pages/activites/etude-de-projet.html
```

Contenu à conserver :

- présentation du bureau d'étude ;
- expertise en études et ingénierie ;
- projets miniers, industriels et pétroliers ;
- accompagnement de la faisabilité à la mise en service ;
- ingénieurs, techniciens et personnel qualifié ;
- lien vers ProEng International.

Lien externe actuel :

```text
https://proeng-international.com/
```

Ne pas remplacer ce lien par une URL inventée.

---

## 5.2 Travaux Miniers

Ancienne URL vérifiée :

```text
/travaux-miniers/
```

Fichier cible :

```text
pages/activites/travaux-miniers.html
```

La page doit présenter :

- travaux miniers ;
- équipements et infrastructures ;
- conception ;
- fabrication ;
- livraison ;
- installation ;
- intervention sur sites miniers ;
- capacités opérationnelles ;
- galerie d'images.

---

## 5.3 Centrale solaire

Ancienne URL vérifiée :

```text
/centrale-solaire/
```

Fichier cible :

```text
pages/activites/centrale-solaire.html
```

La page doit présenter :

- expertise solaire ;
- centrales photovoltaïques ;
- installation ;
- équipements ;
- transition énergétique ;
- références projets ;
- galerie.

Ne pas confondre cette page métier avec la page projet **Centrale Photovoltaïque**.

---

## 5.4 Construction

Destination de catégorie dans le menu :

```text
Construction
```

Créer si nécessaire :

```text
pages/activites/construction.html
```

Cette page peut devenir une landing page présentant :

- construction métallique ;
- construction industrielle ;
- chaudronnerie ;
- dépôts pétroliers ;
- électricité & instrumentation ;
- génie civil ;
- tuyauterie.

Ne pas inventer de chiffres, certifications ou références non présents dans les données de l'entreprise.

---

## 5.5 Chaudronnerie & Dépôts pétroliers

Ancienne URL vérifiée :

```text
/chaudronerie-depot-petroliers/
```

Fichier cible :

```text
pages/activites/chaudronerie-depot-petroliers.html
```

Conserver le sens métier actuel et corriger uniquement les fautes typographiques dans le nouveau site si la validation métier le permet.

---

## 5.6 Construction Industrielle

Ancienne URL vérifiée :

```text
/construction-industrielle/
```

Fichier cible :

```text
pages/activites/construction-industrielle.html
```

Présenter :

- structures métalliques ;
- installations industrielles ;
- montage ;
- équipements ;
- mise en service ;
- projets industriels.

---

## 5.7 Electricité & Instrumentation

Ancienne URL vérifiée :

```text
/electricite-instrumentation/
```

Fichier cible :

```text
pages/activites/electricite-instrumentation.html
```

Présenter :

- électricité industrielle ;
- instrumentation ;
- installation ;
- contrôle ;
- mise en service ;
- maintenance/interventions associées si validées.

---

## 5.8 Génie Civil

Ancienne URL vérifiée :

```text
/genie-civil/
```

Fichier cible :

```text
pages/activites/genie-civil.html
```

Présenter le savoir-faire génie civil sans inventer de réalisations.

---

## 5.9 Tuyauterie

Ancienne URL vérifiée :

```text
/tuyauterie/
```

Fichier cible :

```text
pages/activites/tuyauterie.html
```

Présenter :

- fabrication ;
- installation ;
- montage ;
- tests ;
- rinçage/nettoyage lorsque pertinent ;
- tuyauterie industrielle ;
- intégration avec les projets EPC.

---

## 5.10 Irrigation Réseaux

Ancienne URL vérifiée :

```text
/irrigation-reseaux/
```

Fichier cible :

```text
pages/activites/irrigation-reseaux.html
```

Présenter le service d'irrigation et de réseaux.

---

## 5.11 Aménagement de Containers

Ancienne URL vérifiée :

```text
/amenagement-de-containers/
```

Fichier cible :

```text
pages/activites/amenagement-de-containers.html
```

Présenter :

- aménagement ;
- transformation ;
- adaptation aux besoins de chantier ;
- usages industriels/logistiques.

---

## 5.12 Logistique & Fourniture

Ancienne URL vérifiée :

```text
/logistique-et-fourniture/
```

Fichier cible :

```text
pages/activites/logistique-et-fourniture.html
```

La page actuelle mentionne notamment :

- fourniture de matériel ;
- gestion des délais de livraison ;
- moyens matériels ;
- machines de transport ;
- machines de levage ;
- moyens de déplacement ;
- machines de service.

Conserver une galerie structurée.

---

## 5.13 Maintenance Industrielle

Ancienne URL vérifiée :

```text
/maintenance-industrielle/
```

Fichier cible :

```text
pages/activites/maintenance-industrielle.html
```

Présenter :

- maintenance industrielle ;
- maintenance des installations ;
- interventions techniques ;
- continuité opérationnelle ;
- expertise terrain.

---

# 6. Projets

Ancienne page catalogue :

```text
/nos-projets/
```

Fichier cible :

```text
pages/projets/index.html
```

La page catalogue actuelle contient notamment :

- Centrale 30MW Zouerate – Mauritanie
- Centrale Thermique de 100 MW
- Centrale Photovoltaique
- Mine d'or

La page d'accueil référence également :

- Cimenterie Atlas – DIO
- Fabrication de réservoirs de dépôt pétrolier
- Mine d'or

**Important :** le catalogue et la home ne sont pas parfaitement synchronisés. Le nouveau site doit centraliser les projets dans `data/projects.js` pour éviter les doublons et incohérences.

---

# 7. Pages projets détaillées

## 7.1 Centrale 30MW Zouerate – Mauritanie

Ancienne URL :

```text
/centrale-30mw-zouerate-mauritanie-2/
```

Fichier :

```text
pages/projets/centrale-30mw-zouerate-mauritanie.html
```

Statut actuel :

```text
En cours
```

Contenu :

- installation d'une centrale thermique de 30 MW ;
- réservoirs ;
- montage mécanique ;
- localisation : Zouerate, Mauritanie ;
- galerie d'images.

---

## 7.2 Centrale Thermique de 100 MW

Ancienne URL :

```text
/projet-thermique/
```

Fichier :

```text
pages/projets/projet-thermique.html
```

Statut :

```text
Terminé
```

Contenu actuel à conserver :

- centrale électrique 100 MW à Bamako ;
- conception et construction de 12 réservoirs ;
- capacité totale de stockage mentionnée : 18 290 m³ ;
- assistance à l'installation de 8 générateurs MAN ;
- tuyauterie ;
- cheminées de 35 m ;
- équipements mécaniques ;
- tuyauterie diamètre 1500 mm ;
- charpente métallique ;
- bardage et toiture ;
- isolation et traitement de surface ;
- opérations logistiques.

Toute donnée technique doit être considérée comme donnée métier et ne doit pas être modifiée sans validation.

---

## 7.3 Centrale Photovoltaïque

Ancienne URL :

```text
/centrale-photovoltaique/
```

Fichier :

```text
pages/projets/centrale-photovoltaique.html
```

Statut :

```text
Terminé
```

Projet :

```text
Centrales Photovoltaïques de la Mine de Somilo Loulo
(PV0 Loulo, PV1 Loulo Road & PV2 Airstrip)
```

Données affichées actuellement :

- 28 507 poteaux ;
- 829 moteurs ;
- 793 trackers ;
- 151 232 modules photovoltaïques ;
- 12 transformateurs ELTAS 11 KW ;
- 4 transformateurs ELTAS 5 KW ;
- 12 armoires chargeuses ;
- 18 armoires à batteries ;
- 60 armoires à cellules ;
- 24 armoires TGBT ;
- 12 armoires IO ;
- 30 containers BESS ;
- 72 MW annoncés pour les 3 centrales.

Le nouveau design doit transformer ces données en blocs statistiques lisibles, sans perdre la précision technique.

Galerie actuelle :

- BESS Containers
- PV1-BIS
- PV2-AIRSTRIP

---

## 7.4 Mine d'or

Ancienne URL :

```text
/syama/
```

Fichier :

```text
pages/projets/syama.html
```

Statut actuel :

```text
En cours
```

Le contenu actuel mentionne :

- conception ;
- livraison ;
- installation d'équipements miniers ;
- trémies ;
- convoyeurs ;
- cuves ;
- réservoirs ;
- déversoirs coniques ;
- tuyauteries ;
- structures métalliques ;
- fabrication en atelier ;
- assemblage sur site ;
- bases opérationnelles ;
- équipes qualifiées ;
- véhicules 4x4 ;
- camions grues ;
- grues mobiles ;
- grues à tour mobiles ;
- automotrices ;
- chariots élévateurs ;
- nacelles.

Galerie projet à conserver.

---

## 7.5 Cimenterie Atlas – DIO

Ancienne URL :

```text
/dio/
```

Fichier :

```text
pages/projets/dio.html
```

Statut :

```text
En cours
```

Contenu :

- localisation : DIO, Cercle de Kati ;
- capacité : 400 000 tonnes/an ;
- montage de structures métalliques ;
- équipements mécaniques ;
- lubrification ;
- mise en service ;
- réception et traitement des matières premières ;
- broyage et ligne pneumatique ;
- silos de stockage et homogénéisation ;
- ensachage et encamionnage ;
- QA/QC ;
- QSHE ;
- essais individuels ;
- essais séquentiels ;
- essais en charge.

---

## 7.6 Fabrication de réservoirs de dépôt pétrolier

Ancienne URL :

```text
/projet-kordian/
```

Fichier :

```text
pages/projets/projet-kordian.html
```

Statut :

```text
En cours
```

Contenu :

- conception ;
- livraison ;
- installation d'équipements miniers ;
- trémies ;
- convoyeurs ;
- cuves ;
- réservoirs ;
- déversoirs coniques ;
- tuyauteries ;
- structures métalliques ;
- fabrication en atelier ;
- transport ;
- assemblage sur site ;
- bases opérationnelles ;
- équipes qualifiées ;
- parc automobile et équipements de levage.

Galerie à conserver.

---

# 8. Valeurs

Page principale :

```text
/nos-valeurs/
```

Fichier :

```text
pages/valeurs/index.html
```

La page actuelle présente notamment :

- ISO 9001 ;
- sécurité et environnement ;
- valeurs humaines ;
- politique qualité ;
- certification.

---

## 8.1 Sécurité et Environnements

Ancienne URL :

```text
/securite/
```

Fichier :

```text
pages/valeurs/securite.html
```

Créer une présentation claire de :

- sécurité ;
- protection des personnes ;
- protection des biens ;
- prévention des risques ;
- environnement ;
- réduction de l'impact environnemental ;
- durabilité.

---

## 8.2 Valeurs Humaines

Ancienne URL :

```text
/valeurs-humaines/
```

Fichier :

```text
pages/valeurs/valeurs-humaines.html
```

Contenu actuel :

- diversité ;
- intégrité ;
- excellence ;
- innovation ;
- responsabilité sociale et environnementale ;
- bien-être des employés ;
- identité collective.

---

## 8.3 Qualité

Ancienne URL :

```text
/qualite/
```

Fichier :

```text
pages/valeurs/qualite.html
```

Mettre en avant :

- ISO 9001 ;
- qualité ;
- conformité ;
- durabilité ;
- satisfaction client ;
- processus de gestion ;
- sécurité ;
- valeurs humaines ;
- environnement.

---

# 9. Offres d'emploi

Ancienne URL :

```text
/offres-demploi/
```

Fichier :

```text
pages/offres-emploi.html
```

Fonctions actuelles :

- liste des postes ;
- recherche par mots-clés ;
- localisation ;
- filtre télétravail ;
- bouton « afficher plus d'offres ».

Le nouveau site ne doit pas afficher un faux système de recrutement statique si les offres sont réellement dynamiques.

Architecture recommandée :

```text
HTML
  ↓
jobs API / JSON
  ↓
JavaScript
  ↓
filtres + affichage
```

Si aucune API n'est disponible pendant la première phase, utiliser `data/jobs.js` ou `data/jobs.json` avec une architecture facilement remplaçable.

---

# 10. Contacts

Ancienne URL :

```text
/contacts/
```

Fichier :

```text
pages/contacts.html
```

Formulaire actuel :

- Nom & Prénom *
- Nom de société *
- E-mail *
- Message
- Envoyer

Le formulaire doit :

- valider côté navigateur ;
- afficher des messages d'erreur accessibles ;
- empêcher les soumissions multiples ;
- afficher un état loading ;
- afficher succès/erreur ;
- être prêt à être branché sur une API ou un backend ;
- ne jamais exposer de secret côté JavaScript.

---

# 11. Agences

Ancienne URL :

```text
/nos-agences/
```

Fichier :

```text
pages/agences.html
```

Agences actuellement visibles sur le site :

### Mali

```text
Niamana - Route de Ségou Mali
+223 92 10 10 10
mali@groupeatc.com
```

### Guinée

```text
Route de Conakry - Manéah Km 43
(+224) 61 20 20 43
guinee@groupeatc.com
```

Catalogue associé actuellement affiché.

### Burkina-Faso

```text
Rue Timbila Roger - secteur 44 Ouidi
(+226) 74 05 49 95
burkina@groupeatc.com
```

### Sénégal

```text
Dakar 79, Rue Joseph GOMIS
(+221) 77 496 45 38
senegal@groupeatc.com
```

### Tunisie

```text
Imm Nour City
(+216) 56 501 927
info@proeng.com
```

### France

```text
56 Bd Belletrud, 06130 GRASSE, France
(+33) 6 50 70 13 53
contact@safexport.fr
```

### Mauritanie

```text
TEVRAGH ZEINA – Nouakchott MAURITANIE
mauritanie@groupeatc.com
```

### Niger

```text
Niger
niger@groupeatc.com
```

### Côte d'Ivoire

Le site actuel affiche :

```text
Côte d'Ivoire
niger@groupeatc.com
```

**ATTENTION : cette adresse semble potentiellement être une erreur de contenu. Ne pas corriger silencieusement. Demander validation métier avant publication.**

Les coordonnées sont des données sensibles au fonctionnement du site : ne pas les inventer, ne pas les « améliorer » avec des informations externes sans validation.

---

# 12. Footer commun

Toutes les pages doivent partager un footer cohérent.

Contenu à prévoir :

- certification ;
- logo ;
- réseaux sociaux ;
- lien vers agences ;
- navigation rapide ;
- contact ;
- copyright.

Réseaux actuellement référencés :

- Facebook
- Twitter/X
- Instagram
- LinkedIn

Les URLs exactes doivent être récupérées depuis les liens officiels du site ou fournies par l'entreprise. Ne jamais inventer une URL sociale.

---

# 13. Header / navigation

Navigation principale actuelle :

```text
ACCUEIL

DOMAINE D'ACTIVITÉS
├── Ingénierie
│   └── Etude de Projet
├── Travaux Miniers
├── Centrale solaire
├── Construction
│   ├── Chaudronerie & Dépôt pétroliers
│   ├── Construction Industrielle
│   ├── Electricité & Instrumentation
│   ├── Génie Civil
│   └── Tuyauterie
├── Irrigation réseaux
├── Aménagement de Containers
├── Logistique & Fournitures
└── Maintenance Industrielle

NOS PROJETS

NOS VALEURS
├── Sécurité et Environnements
├── Valeurs humaines
└── Qualité / Politique Qualité

OFFRES D'EMPLOI

CONTACTS

NOS AGENCES
```

### Desktop

Utiliser :

- navigation claire ;
- dropdowns accessibles ;
- états hover/focus ;
- indication de page active ;
- menu sticky si cohérent avec le design.

### Mobile

Utiliser :

- bouton hamburger ;
- navigation plein écran ou drawer ;
- sous-menus accordéon ;
- fermeture avec Escape ;
- focus management ;
- verrouillage du scroll lorsque le menu est ouvert.

---


# 14. Brand / Design System — Groupe ATC

Cette section est une **contrainte de design officielle** du projet. Toute nouvelle page, section ou composant doit respecter ce système avant toute préférence esthétique personnelle.

## 14.1 Identité de marque

Groupe ATC doit être présenté comme une entreprise :

- industrielle ;
- technique ;
- fiable ;
- premium ;
- institutionnelle ;
- moderne ;
- internationale ;
- orientée projets et expertise.

Le design doit transmettre la **solidité**, la **précision technique** et la **confiance**, sans tomber dans un style corporate générique.

---

## 14.2 Palette officielle

### Bleu Groupe ATC — couleur primaire

```text
HEX: #00235A
RGB: 0, 35, 90
```

Usage principal :

- header ;
- navigation ;
- titres sur fonds clairs ;
- backgrounds institutionnels ;
- footer ;
- boutons primaires ;
- éléments structurants ;
- overlays ;
- liens importants.

### Orange Groupe ATC — couleur accent

```text
HEX: #E45204
RGB: 228, 82, 4
```

Usage principal :

- CTA ;
- boutons secondaires ;
- états actifs ;
- indicateurs ;
- badges ;
- soulignements de titres ;
- accents visuels ;
- statistiques importantes ;
- éléments interactifs.

### Neutres

Les neutres sont autorisés pour créer une hiérarchie visuelle :

```text
White:       #FFFFFF
Near Black:  #111111
Light Gray:  #F4F5F7
Border Gray: #E5E7EB
Medium Gray: #6B7280
```

Ces valeurs sont fonctionnelles et peuvent être ajustées légèrement si les tests de contraste/accessibilité l'exigent.

---

## 14.3 Règle 60 / 30 / 10

La composition générale doit viser approximativement :

```text
60% — blanc / surfaces neutres
30% — bleu #00235A
10% — orange #E45204
```

Ce ratio est une **direction artistique**, pas une règle mathématique absolue.

L'orange doit rester un accent. Ne pas transformer une page entière en orange.

---

## 14.4 Contraste et lisibilité

Toujours vérifier le contraste.

Sur fond bleu :

```text
Texte principal → blanc
Accent orange → à utiliser avec vérification du contraste
```

Sur fond blanc :

```text
Texte principal → bleu #00235A ou noir
Accent → orange #E45204
```

Ne jamais utiliser du texte gris clair sur blanc pour les informations importantes.

L'accessibilité est prioritaire sur une correspondance de couleur purement esthétique.

---

# 15. Typographie officielle

## 15.1 Futura — texte courant

**Futura** est la police officielle pour :

- paragraphes ;
- descriptions ;
- textes de cartes ;
- labels ;
- formulaires ;
- informations secondaires ;
- chiffres lorsque leur lisibilité est prioritaire.

Variable :

```css
--font-body: "Futura", sans-serif;
```

La police doit être chargée depuis les fichiers légalement fournis/licenciés par Groupe ATC.

Ne jamais télécharger ou embarquer une copie non autorisée.

---

## 15.2 SciFly — titres et navigation

**SciFly** est la police officielle pour :

- H1 ;
- H2 ;
- H3 ;
- H4 ;
- titres de sections ;
- menus principaux ;
- sous-menus ;
- boutons lorsque le texte est très court ;
- labels institutionnels importants ;
- éléments de navigation.

Variables :

```css
--font-heading: "SciFly", sans-serif;
--font-menu: "SciFly", sans-serif;
```

SciFly doit être utilisée avec modération dans les paragraphes longs.

---

## 15.3 Hiérarchie typographique

Valeurs de départ recommandées :

```text
H1 desktop : 56–72px
H1 mobile  : 36–46px

H2 desktop : 40–52px
H2 mobile  : 30–38px

H3 desktop : 28–36px
H3 mobile  : 24–30px

H4 desktop : 22–28px
H4 mobile  : 20–24px

Body desktop : 16–18px
Body mobile  : 15–17px

Small : 13–14px
```

Utiliser `clamp()` pour les titres lorsque pertinent :

```css
font-size: clamp(2.25rem, 5vw, 4.5rem);
```

Ne pas appliquer les valeurs aveuglément : le contenu et la longueur du titre doivent guider le dimensionnement.

---

## 15.4 Line-height

Références :

```text
Titres      : 0.95 – 1.15
Sous-titres  : 1.1 – 1.25
Paragraphes  : 1.5 – 1.75
Menus        : 1.1 – 1.3
```

Les titres SciFly peuvent nécessiter une correction de `line-height` spécifique après intégration réelle de la police.

---

## 15.5 Letter spacing

Par défaut :

```text
Body : normal
Titres : légèrement serré
Menus : normal ou légèrement espacé
```

Ne jamais utiliser une valeur extrême simplement pour donner un aspect « futuriste ».

---

# 16. Système d'espacement

Utiliser une échelle cohérente.

Base recommandée :

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.5rem;   /* 24px */
--space-6: 2rem;     /* 32px */
--space-7: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-9: 6rem;     /* 96px */
--space-10: 8rem;    /* 128px */
```

Les sections importantes peuvent utiliser :

```css
padding-block: clamp(4rem, 8vw, 8rem);
```

Éviter les espacements arbitraires différents à chaque page.

---

# 17. Grille et largeur

Container principal :

```css
--container-max: 1440px;
```

Référence :

```css
.container {
  width: min(100% - 2rem, var(--container-max));
  margin-inline: auto;
}
```

Sur très grands écrans, conserver une marge respirante.

Le contenu textuel long ne doit généralement pas dépasser environ :

```text
65–80 caractères par ligne
```

---

# 18. Boutons

## Primary

Fond :

```text
#E45204
```

Texte :

```text
#FFFFFF
```

Usage :

- Contact ;
- Demander un devis ;
- Découvrir le projet ;
- CTA principal.

## Secondary

Fond :

```text
#00235A
```

Texte :

```text
#FFFFFF
```

## Outline

Bordure :

```text
#00235A
```

Texte :

```text
#00235A
```

Hover :

```text
background: #00235A
color: #FFFFFF
```

### Style

Les boutons doivent être :

- clairement cliquables ;
- suffisamment grands sur mobile ;
- cohérents entre les pages ;
- sans effets 3D inutiles.

Minimum recommandé :

```text
hauteur : 44px
padding horizontal : 20–28px
```

Les zones tactiles doivent viser au moins environ `44 × 44px`.

---

# 19. Formes et bordures

Le style Groupe ATC doit rester relativement architectural.

Préférence :

```text
radius petit ou modéré
```

Références :

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
```

Éviter les cartes entièrement arrondies façon application SaaS.

Les lignes et bordures fines peuvent être utilisées pour rappeler le caractère industriel/technique.

---

# 20. Ombres

Utiliser les ombres avec parcimonie.

```css
--shadow-sm: 0 2px 8px rgb(0 0 0 / 0.06);
--shadow-md: 0 8px 24px rgb(0 0 0 / 0.10);
--shadow-lg: 0 20px 50px rgb(0 0 0 / 0.14);
```

Une section ne doit pas avoir simultanément :

- ombre forte ;
- gradient ;
- animation importante ;
- bordure ;
- plusieurs couleurs d'accent.

La hiérarchie doit rester sobre.

---

# 21. Header

Le header est un élément de marque majeur.

### Desktop

Préférer :

```text
logo
navigation SciFly
CTA éventuel
```

**Décision validée (2026-09-12, conforme au site source actuel) :** le header desktop utilise un fond **blanc** `#FFFFFF` (pas bleu), avec la navigation en bleu `#00235A` et un soulignement orange `#E45204` pour l'état actif/survolé/ouvert. Ceci remplace la règle initiale « le bleu domine le header » pour le header desktop uniquement.

Le menu actif utilise :

```text
orange #E45204
```

sous forme de soulignement.

### Mobile

Le menu (drawer plein écran) doit conserver :

- identité bleue (fond `#00235A`, texte blanc) ;
- typographie SciFly ;
- CTA orange ;
- hiérarchie claire.

Le menu mobile ne doit pas être une simple réduction du desktop : il doit être pensé pour le tactile.

---

# 22. Hero

Le Hero doit être le principal élément visuel de chaque page importante.

Composition recommandée :

```text
Image forte
+
overlay bleu si nécessaire
+
H1 SciFly
+
court texte Futura
+
CTA orange
```

Éviter de couvrir une image de texte excessif.

Pour les pages projets :

```text
Projet
Statut
Localisation
Hero image
```

doivent être immédiatement identifiables.

---

# 23. Titres de sections

Pattern recommandé :

```text
petit label / eyebrow
        ↓
H2 SciFly
        ↓
ligne ou accent orange
        ↓
description Futura
```

L'accent orange doit rester fin et intentionnel.

Exemple conceptuel :

```text
NOS SAVOIR-FAIRE

CONSTRUIRE POUR DURER
──────────────
Notre expertise...
```

Ne pas appliquer ce pattern mécaniquement à toutes les sections.

---

# 24. Cartes

Les cartes d'activités/projets doivent privilégier :

```text
image
titre SciFly
description Futura
métadonnées
CTA
```

Une image peut être au premier plan avec overlay au hover.

Hover recommandé :

```text
transform: translateY(-4px)
```

ou léger zoom image :

```text
transform: scale(1.03)
```

Éviter :

- rotation ;
- rebond ;
- glow ;
- effets flashy.

---

# 25. Projets

Les projets sont un élément central de la marque.

Chaque carte projet doit rendre immédiatement visibles :

```text
Nom
Localisation
Statut
Image
```

Les statuts doivent être cohérents :

```text
EN COURS
TERMINÉ
```

Couleur d'accent :

```text
#E45204
```

La fiche détaillée doit avoir une hiérarchie éditoriale forte et donner une impression d'étude de cas industrielle.

---

# 26. Chiffres clés

Les chiffres clés doivent utiliser une typographie forte.

Recommandation :

```text
valeur → SciFly
label  → Futura
```

L'orange peut être utilisé pour les chiffres ou un indicateur.

Ne jamais afficher un chiffre dont la source est inconnue ou manifestement cassée.

---

# 27. Photos et direction artistique

Priorité aux images :

- chantiers ;
- structures métalliques ;
- équipements ;
- équipes ;
- centrales ;
- mines ;
- ateliers ;
- projets terminés ;
- installations industrielles.

Le traitement photo doit rester réaliste.

Éviter les images stock trop génériques lorsque des photos Groupe ATC existent.

---

# 28. Icônes

Les icônes doivent être :

- simples ;
- géométriques ;
- cohérentes ;
- principalement monochromes ;
- adaptées à un environnement industriel.

Ne pas mélanger plusieurs styles d'icônes.

Le bleu et l'orange peuvent servir à différencier état normal/actif.

---

# 29. États interactifs

Chaque élément interactif doit avoir :

```text
default
hover
focus-visible
active
disabled
```

Le `focus-visible` doit être particulièrement visible.

Exemple :

```css
:focus-visible {
  outline: 3px solid #E45204;
  outline-offset: 3px;
}
```

Adapter si nécessaire pour conserver un contraste suffisant.

---

# 30. Dark sections

Les sections sombres sont autorisées et recommandées pour créer du rythme.

Pattern principal :

```text
background: #00235A
text: #FFFFFF
accent: #E45204
```

Ne pas utiliser du noir pur comme couleur principale de marque.

---

# 31. Responsive design

Le design system doit être pensé mobile-first.

Breakpoints indicatifs :

```text
~480px
~768px
~1024px
~1280px
~1440px
```

Ne pas dépendre exclusivement de ces valeurs.

Tester le comportement réel du contenu.

---

# 32. Règles de cohérence

Une nouvelle page doit réutiliser :

```text
les mêmes couleurs
les mêmes fonts
les mêmes boutons
les mêmes espacements
les mêmes cards
les mêmes états
les mêmes conventions
```

Si un nouveau composant semble nécessaire, vérifier d'abord si un composant existant peut être étendu.

---

# 33. Interdictions Brand

Ne pas :

- changer le bleu officiel ;
- changer l'orange officiel ;
- utiliser SciFly pour de longs paragraphes ;
- utiliser Futura pour les menus principaux ;
- mélanger 4 ou 5 familles de polices ;
- utiliser des couleurs saturées supplémentaires sans justification ;
- faire de l'orange la couleur dominante ;
- ajouter des gradients multicolores ;
- utiliser du glassmorphism ;
- utiliser des effets néon ;
- créer un style SaaS ;
- utiliser des animations agressives.

---

# 34. Variables CSS officielles

Le fichier `css/variables.css` doit commencer avec une base similaire :

```css
:root {
  /* Brand */
  --color-primary: #00235A;
  --color-accent: #E45204;

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-black: #111111;
  --color-gray-50: #F4F5F7;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;

  /* Typography */
  --font-body: "Futura", sans-serif;
  --font-heading: "SciFly", sans-serif;
  --font-menu: "SciFly", sans-serif;

  /* Layout */
  --container-max: 1440px;

  /* Spacing */
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

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgb(0 0 0 / 0.06);
  --shadow-md: 0 8px 24px rgb(0 0 0 / 0.10);
  --shadow-lg: 0 20px 50px rgb(0 0 0 / 0.14);

  /* Motion */
  --transition-fast: 160ms ease;
  --transition-base: 280ms ease;
  --transition-slow: 500ms ease;
}
```

Les valeurs peuvent être ajustées après intégration réelle des polices et tests d'accessibilité, mais les couleurs de marque restent :

```text
#00235A
#E45204
```


# 15. Direction artistique

Le nouveau site doit être :

- industriel ;
- premium ;
- institutionnel ;
- moderne ;
- sobre ;
- professionnel ;
- africain/international ;
- crédible ;
- visuellement fort.

Éviter :

- effets flashy ;
- animations excessives ;
- gradients inutiles ;
- glassmorphism générique ;
- cartes de type template SaaS ;
- ombres lourdes ;
- composants WordPress reconnaissables ;
- carrousels partout.

Les images de chantiers, d'équipes, d'équipements et de réalisations doivent être les éléments visuels principaux.

---

# 16. Images

Ne jamais utiliser une image externe au hasard simplement pour remplir une section.

Toutes les images doivent avoir :

- un nom de fichier propre ;
- une catégorie ;
- un `alt` pertinent ;
- une taille optimisée ;
- un format moderne lorsque possible (`webp`/`avif`) ;
- une version responsive si nécessaire.

Exemple :

```text
assets/images/projets/zouerate/
├── hero.webp
├── centrale-01.webp
├── centrale-02.webp
└── centrale-03.webp
```

---

# 17. JavaScript

JavaScript doit rester modulaire.

Ne pas créer un énorme :

```text
main.js
```

de plusieurs milliers de lignes.

Responsabilités :

```text
navigation.js
    menu mobile
    dropdowns
    active states

slider.js
    hero slider
    project slider

counters.js
    chiffres clés

animations.js
    IntersectionObserver
    reveal animations

gallery.js
    lightbox
    navigation images

filters.js
    projets
    offres d'emploi

forms.js
    validation
    états formulaire
```

---

# 18. Animations

Préférer :

```text
opacity
transform
clip-path
scale
```

Éviter les animations coûteuses sur :

```text
width
height
top
left
```

Respecter :

```css
@media (prefers-reduced-motion: reduce) {
  ...
}
```

Aucune animation ne doit empêcher l'utilisateur d'accéder au contenu.

---

# 19. Accessibilité

Objectif minimum :

```text
WCAG 2.2 AA
```

Obligatoire :

- HTML sémantique ;
- titres hiérarchisés ;
- labels de formulaires ;
- navigation clavier ;
- focus visible ;
- contraste suffisant ;
- `aria-expanded` pour menus ;
- `aria-current` lorsque pertinent ;
- textes alternatifs ;
- `prefers-reduced-motion` ;
- aucun contenu important accessible uniquement au hover.

---

# 20. SEO

Chaque page doit avoir :

```html
<title>...</title>
<meta name="description" content="...">
<link rel="canonical" href="...">
```

Ajouter selon besoin :

- Open Graph ;
- Twitter/X cards ;
- données structurées ;
- breadcrumbs ;
- sitemap ;
- robots.txt.

Pour les projets, envisager `Article` ou `CreativeWork` selon le contenu final.

Pour les pages entreprise, envisager `Organization` / `LocalBusiness` uniquement lorsque les données sont suffisamment fiables.

---

# 21. Performance

Objectifs :

- images optimisées ;
- lazy loading ;
- dimensions explicites des images ;
- pas de librairies inutiles ;
- pas de scripts bloquants ;
- CSS rationalisé ;
- JS différé ;
- fonts limitées ;
- animations GPU-friendly ;
- excellent Core Web Vitals.

Ne jamais sacrifier la performance uniquement pour un effet visuel.

---

# 22. Sécurité

Ne jamais mettre :

- clés API ;
- tokens ;
- mots de passe ;
- secrets ;
- credentials

dans :

```text
HTML
CSS
JS
```

Un formulaire nécessitant un secret doit passer par un backend.

Toujours échapper/sanitizer les données dynamiques côté serveur si un backend est ajouté.

---

# 23. Données

Les contenus répétitifs doivent être centralisés.

Exemple :

```js
const projects = [
  {
    slug: "centrale-30mw-zouerate-mauritanie",
    title: "Centrale 30MW Zouerate – Mauritanie",
    status: "En cours",
    location: "Zouerate, Mauritanie",
    ...
  }
];
```

Même principe pour :

```text
activities.js
projects.js
agencies.js
jobs
```

Le but est d'éviter de modifier 10 fichiers HTML pour une seule donnée.

---

# 24. Règle importante sur les contenus

Il existe des incohérences dans le WordPress actuel.

Exemples constatables :

- certains compteurs affichent `0` ;
- certains contenus utilisent des formulations anciennes ;
- certaines coordonnées semblent nécessiter validation ;
- la liste des projets de la home et celle de la page projets ne sont pas parfaitement identiques ;
- certaines pages ont un contenu très court.

**Ne jamais inventer une correction métier.**

Lorsqu'une donnée semble incorrecte :

```text
TODO: VALIDATION MÉTIER
```

et conserver la donnée source dans les notes de migration.

---

# 25. Migration des URLs

Le nouveau site doit conserver autant que possible les URLs existantes :

```text
/
/nos-projets/
/nos-valeurs/
/offres-demploi/
/contacts/
/nos-agences/
/etude-de-projet/
/travaux-miniers/
/centrale-solaire/
/construction/
/chaudronerie-depot-petroliers/
/construction-industrielle/
/electricite-instrumentation/
/genie-civil/
/tuyauterie/
/irrigation-reseaux/
/amenagement-de-containers/
/logistique-et-fourniture/
/maintenance-industrielle/
/securite/
/valeurs-humaines/
/qualite/
/centrale-30mw-zouerate-mauritanie-2/
/projet-thermique/
/centrale-photovoltaique/
/dio/
/projet-kordian/
/syama/
```

Si une URL doit changer :

1. documenter l'ancienne URL ;
2. documenter la nouvelle ;
3. mettre en place une redirection 301 côté serveur.

---

# 26. Pages 404

Créer :

```text
404.html
```

La page doit :

- expliquer que la page est introuvable ;
- proposer retour accueil ;
- proposer navigation principale ;
- rester dans le design Groupe ATC.

---

# 27. Tests obligatoires

Avant chaque livraison :

### Navigation

- [ ] tous les liens fonctionnent ;
- [ ] aucun lien WordPress ne reste ;
- [ ] menu desktop ;
- [ ] menu mobile ;
- [ ] dropdowns ;
- [ ] breadcrumbs.

### Responsive

Tester au minimum :

```text
320px
375px
390px
768px
1024px
1280px
1440px
1920px
```

### Formulaires

- [ ] validation ;
- [ ] erreurs ;
- [ ] succès ;
- [ ] loading ;
- [ ] clavier ;
- [ ] mobile.

### Images

- [ ] alt ;
- [ ] dimensions ;
- [ ] lazy loading ;
- [ ] images absentes détectées.

### SEO

- [ ] title ;
- [ ] description ;
- [ ] canonical ;
- [ ] H1 unique ;
- [ ] sitemap ;
- [ ] robots.

### Accessibilité

- [ ] clavier ;
- [ ] focus ;
- [ ] contraste ;
- [ ] labels ;
- [ ] réduction des animations.

### Performance

- [ ] Lighthouse ;
- [ ] poids des images ;
- [ ] JS ;
- [ ] CSS ;
- [ ] Core Web Vitals.

---

# 28. Workflow de développement

Toujours suivre cet ordre :

```text
1. Comprendre la page WordPress actuelle
2. Identifier son contenu
3. Identifier ses assets
4. Identifier ses liens
5. Définir la structure HTML
6. Construire le composant
7. Construire le responsive
8. Ajouter les interactions JS
9. Ajouter les animations
10. Tester clavier/accessibilité
11. Tester mobile
12. Tester liens
13. Tester SEO
14. Optimiser performances
15. Vérifier visuellement avec la page source
```

Ne pas commencer par les animations.

---

# 29. Composants réutilisables

Même avec du HTML vanilla, penser en composants.

Composants recommandés :

```text
Header
MobileMenu
Breadcrumb
Hero
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
Footer
```

Ne pas copier-coller 15 versions différentes du même composant.

---

# 30. Règle de qualité du code

Le code doit être :

- lisible ;
- prévisible ;
- commenté uniquement lorsque nécessaire ;
- sans duplication inutile ;
- sans hacks ;
- sans CSS `!important` généralisé ;
- sans sélecteurs extrêmement spécifiques ;
- sans IDs utilisés uniquement pour le style ;
- sans JavaScript inline sauf nécessité exceptionnelle.

Préférer :

```html
<button class="js-menu-toggle">
```

et :

```js
document.querySelector('.js-menu-toggle')
```

plutôt que de mélanger comportement et style.

---

# 31. Ce qui est interdit

Ne pas :

- réintroduire Elementor ;
- réintroduire WPBakery ;
- réintroduire jQuery juste pour reproduire un vieux plugin ;
- copier le CSS compilé WordPress ;
- copier les classes générées par Elementor ;
- utiliser 5 librairies pour un simple slider ;
- télécharger des images sans licence ;
- inventer des coordonnées ;
- inventer des références clients ;
- inventer des chiffres ;
- supprimer du contenu métier sans justification ;
- casser les URLs sans redirection ;
- ajouter une animation parce que « cela fait moderne ».

---

# 32. Critère de réussite

Le nouveau site est considéré comme réussi lorsque :

```text
Visuellement
    ≥ identité actuelle
    + design plus moderne

Technique
    WordPress indépendant
    aucune dépendance plugin legacy

Performance
    rapide sur mobile

Responsive
    parfait de 320px à grand écran

Accessibilité
    navigation clavier + lecteur d'écran cohérente

SEO
    URLs + metadata + sitemap propres

Maintenance
    composants réutilisables
    données centralisées
    architecture claire
```

---

# 33. Checklist finale des pages

```text
[ ] Accueil
[ ] Domaine d'activités / landing
[ ] Ingénierie / catégorie si retenue
[ ] Étude de Projet
[ ] Travaux Miniers
[ ] Centrale solaire
[ ] Construction / catégorie si retenue
[ ] Chaudronnerie & Dépôts pétroliers
[ ] Construction Industrielle
[ ] Electricité & Instrumentation
[ ] Génie Civil
[ ] Tuyauterie
[ ] Irrigation Réseaux
[ ] Aménagement de Containers
[ ] Logistique & Fourniture
[ ] Maintenance Industrielle

[ ] Nos Projets
[ ] Centrale 30MW Zouerate – Mauritanie
[ ] Centrale Thermique de 100 MW
[ ] Centrale Photovoltaïque
[ ] Cimenterie Atlas – DIO
[ ] Fabrication de réservoirs de dépôt pétrolier
[ ] Mine d'or

[ ] Nos Valeurs
[ ] Sécurité et Environnements
[ ] Valeurs Humaines
[ ] Qualité

[ ] Offres d'emploi
[ ] Contacts
[ ] Nos Agences
[ ] 404
```

---

# 34. Référence de migration

Le site WordPress actuel doit rester accessible pendant toute la migration.

Ne pas supprimer ou modifier l'ancien site avant :

1. validation du nouveau contenu ;
2. validation du design ;
3. validation des URLs ;
4. validation mobile ;
5. validation des formulaires ;
6. validation SEO ;
7. sauvegarde complète de WordPress ;
8. plan de rollback.

