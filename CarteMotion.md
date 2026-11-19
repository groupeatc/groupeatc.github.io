Je veux améliorer le motion design de la section de mon site qui présente la présence internationale du **Groupe ATC**.

### Contexte

Le site présente une carte du monde.

Sur cette carte, plusieurs `hotspot_dot` indiquent les différents pays dans lesquels **le Groupe ATC est présent**.

Le **Mali est le point central du réseau**, car c'est là que se trouve la société mère / le siège du Groupe ATC.

L'objectif est donc de transformer cette carte en une **visualisation animée du réseau international du Groupe ATC**, avec le Mali comme point d'origine.

L'idée visuelle doit être immédiatement compréhensible :

**Groupe ATC — Mali → réseau international → différents pays de présence**

### Concept principal

Je veux que le **Mali soit traité comme le hub central du Groupe ATC**.

Les différents pays ne doivent pas être simplement représentés comme des points indépendants.

Ils doivent donner l'impression d'être **connectés au Groupe ATC depuis son point d'origine au Mali**.

Visuellement :

**MALI / GROUPE ATC ● ─────→ ● Pays 1**
**MALI / GROUPE ATC ● ─────→ ● Pays 2**
**MALI / GROUPE ATC ● ─────→ ● Pays 3**

Les connexions doivent apparaître progressivement et créer une impression de réseau international vivant.

### Motion design

Au chargement de la section :

1. La carte apparaît de manière sobre.
2. Le hotspot du Mali apparaît en premier.
3. Le hotspot du Mali possède un halo/glow subtil et une pulsation lente.
4. Une première connexion part du Mali vers un autre pays.
5. Un petit point lumineux se déplace le long de cette connexion.
6. Le hotspot du pays destinataire s'active lorsqu'il reçoit le flux.
7. Les autres connexions apparaissent progressivement.
8. À la fin, l'ensemble du réseau international du Groupe ATC est visible.

L'animation doit donner une impression de **rayonnement international depuis le Mali**.

### Style visuel

Le rendu doit être :

* premium ;
* corporate ;
* élégant ;
* moderne ;
* technologique mais pas futuriste ;
* fluide ;
* subtil.

Je ne veux PAS d'un rendu de type science-fiction ou "hacker".

Éviter :

* les grosses lignes ;
* les explosions lumineuses ;
* les particules excessives ;
* les effets néon trop forts ;
* les animations rapides ;
* les éléments qui distraient de la carte.

Privilégier :

* lignes SVG fines ;
* glow subtil ;
* petits flux lumineux ;
* transitions douces ;
* pulsations discrètes ;
* opacité et blur maîtrisés.

### Hiérarchie

Le hotspot du **Mali / Groupe ATC** doit être clairement identifiable comme le point central.

Il peut avoir :

* une taille légèrement supérieure ;
* un halo plus important ;
* une pulsation lente ;
* un label discret comme `GROUPE ATC` ou `HEADQUARTERS — MALI`.

Les autres hotspots restent plus discrets.

Il faut cependant éviter que le Mali prenne tellement d'importance qu'il masque les autres pays.

### Connexions

Les connexions doivent être élégantes et géographiquement cohérentes.

Si la carte est une projection 2D, utiliser des courbes plutôt que des lignes parfaitement droites lorsque cela améliore le rendu.

Par exemple :

**Mali ● 〰〰〰→ ● Pays**

Le mouvement du point lumineux doit suivre exactement la trajectoire de la connexion.

Le flux peut fonctionner ainsi :

`Mali → pays`

Puis, après quelques secondes, une autre connexion est activée.

Les connexions peuvent ensuite continuer à avoir de petits flux périodiques afin que le réseau reste vivant.

### Animation en boucle

Créer une boucle continue et naturelle.

Je veux éviter le classique :

`animation → arrêt → reset brutal → animation`

Préférer :

`apparition du réseau → activité des connexions → état stable → nouveaux flux → nouvelle séquence`

Le réseau doit donner l'impression d'être **constamment actif**.

### Hover

Lorsque l'utilisateur passe la souris sur un pays :

* le hotspot devient légèrement plus lumineux ;
* sa connexion avec le Mali est accentuée ;
* le nom du pays peut apparaître ;
* les autres connexions peuvent légèrement réduire leur intensité.

Le hover doit rester subtil.

### Important : utiliser le code existant

Je veux que tu travailles **à partir de la carte et des hotspots déjà présents dans mon projet**.

Ne recrée pas inutilement toute la section.

Avant de modifier le code :

1. identifie le composant qui rend la carte ;
2. identifie les `hotspot_dot` ;
3. identifie leurs coordonnées ;
4. identifie le hotspot correspondant au Mali ;
5. comprends comment la carte est responsive ;
6. ajoute ensuite la couche de motion design.

Conserve autant que possible :

* la structure existante ;
* les données existantes ;
* les positions des hotspots ;
* le responsive ;
* le design actuel ;
* les composants déjà présents.

### Performance

Le motion design doit être performant.

Privilégier :

* SVG pour les trajectoires ;
* CSS animations lorsque possible ;
* `transform` et `opacity` ;
* `requestAnimationFrame` uniquement si nécessaire ;
* pas de re-render React inutile à chaque frame.

Les trajectoires doivent rester correctement alignées avec les hotspots lorsque la carte change de taille.

### Responsive

Desktop, tablette et mobile doivent être pris en charge.

Sur mobile, simplifier l'animation si nécessaire :

* moins de connexions simultanées ;
* glow moins intense ;
* moins de flux ;
* animation plus légère.

Mais le concept doit rester identique :

**GROUPE ATC — MALI → RÉSEAU INTERNATIONAL**

### Accessibilité

Respecter `prefers-reduced-motion`.

Si la réduction des animations est activée :

* supprimer les mouvements complexes ;
* garder les hotspots et les connexions visibles ;
* conserver une représentation statique du réseau.

### Message visuel

Le motion design doit raconter cette histoire sans avoir besoin de l'expliquer :

> **Le Groupe ATC est ancré au Mali et développe sa présence à l'international.**

Le Mali doit donc être perçu comme **le cœur / point d'origine du Groupe ATC**, tandis que les autres hotspots représentent son implantation et sa présence internationale.

Je veux un résultat qui ressemble davantage à une **visualisation élégante d'un réseau international** qu'à une simple animation de carte.

Analyse d'abord mon implémentation actuelle, puis propose et implémente la meilleure solution directement dans l'architecture existante.
