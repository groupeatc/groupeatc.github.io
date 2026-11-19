# Bibliothèques tierces (copiées localement, sans CDN ni build)

Décision du propriétaire du projet (18 octobre 2026) : GSAP et Three.js sont
autorisés pour les animations. Fichiers ES modules regroupés et minifiés avec
esbuild depuis les paquets npm officiels.

| Fichier | Version | Poids gzip | Licence |
|---|---|---|---|
| `gsap/gsap.min.js` (cœur + CSSPlugin) | gsap 3.15.0 | 28 Ko | GSAP Standard « no charge » — https://gsap.com/standard-license |
| `gsap/ScrollTrigger.min.js` | gsap 3.15.0 | 18 Ko | idem |
| `gsap/SplitText.min.js` | gsap 3.15.0 | 3,5 Ko | idem |
| `gsap/DrawSVGPlugin.min.js` | gsap 3.15.0 | 2 Ko | idem |
| `three/three.module.min.js` | three 0.186.1 | 189 Ko | MIT (`three/LICENSE`) |

## Règles d'usage

- Importer **uniquement dans les scripts de page** (`js/pages/*.js`), jamais
  dans `js/main.js` : une page qui n'anime rien ne charge rien.
- **Three.js** : charger à la demande (`await import(...)`) quand la scène
  approche de l'écran, uniquement là où une scène 3D raconte quelque chose ;
  prévoir une image fixe à la place (sans WebGL, `prefers-reduced-motion`,
  petits écrans lents).
- Toujours respecter `prefers-reduced-motion` (`gsap.matchMedia()`).

```js
import { gsap } from "/js/vendor/gsap/gsap.min.js";
import { ScrollTrigger } from "/js/vendor/gsap/ScrollTrigger.min.js";
gsap.registerPlugin(ScrollTrigger);

const THREE = await import("/js/vendor/three/three.module.min.js");
```

Mise à jour : `npm pack gsap three`, puis
`esbuild <entrée> --bundle --minify --format=esm --legal-comments=inline`.
