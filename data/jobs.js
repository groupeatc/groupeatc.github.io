// Job offers for pages/offres-emploi.html (rendered by js/pages/emploi.js).
//
// Source: the live site's WP Job Manager listings (groupeatc.com/offres-demploi/),
// texts reproduced from each posting. Replace this file — or swap
// loadJobs() in js/pages/emploi.js for a fetch() to a jobs API/JSON feed —
// without touching the page.
//
// TODO: VALIDATION MÉTIER — ces deux offres ont été publiées en 2023 : vérifier
// qu'elles sont toujours ouvertes avant la mise en ligne (sinon les retirer ;
// la page affiche alors la candidature spontanée seule).

export const APPLY_EMAIL = "rh.mali@groupeatc.com";

export const jobs = [
  {
    id: "ingenieur-charge-daffaires",
    title: "Ingénieur chargé d'affaires",
    location: "Bamako, Mali",
    contract: "CDI",
    remote: false,
    published: "2023-04-22",
    domain: "Projets",
    summary: "Interface entre l'entreprise et ses clients majeurs, principalement sur des sites d'exploitation ou d'exploration aurifères.",
    sections: [
      {
        title: "Vos missions",
        text: "Au sein du pôle projets, sous la responsabilité de la direction générale et en collaboration avec l'ensemble des services de la société, vous assurez l'interface entre l'entreprise et le client. Vous suivez de près les affaires en cours, les demandes en attente et les besoins futurs d'un ou plusieurs clients.",
        items: [
          "Entretenir de bonnes relations avec les clients, notamment en se rendant régulièrement sur les sites",
          "Suivre les demandes de devis (études et chiffrage au bureau d'études, offre par le service commercial)",
          "Suivre les commandes, avec le service commercial puis l'atelier pour la fabrication",
          "Suivre les chantiers : visites régulières, réunions de suivi avec le client",
          "Veiller au respect des délais et des spécifications techniques, jusqu'à la validation et la réception",
          "Analyser les coûts tout au long du projet",
        ],
      },
      {
        title: "Résultats attendus",
        items: [
          "Prise en main et gestion en autonomie d'un portefeuille de projets",
          "Respect des délais et amélioration continue de la satisfaction client",
          "Anticipation des besoins client et étude des coûts par projet",
          "Mise en place éventuelle d'outils d'aide à la gestion de projet",
        ],
      },
      {
        title: "Votre profil",
        items: [
          "Ingénieur en mécanique, industrie minière ou procédés de fabrication",
          "Anglais indispensable",
          "Capacité de raisonnement et d'analyse, méthode et rigueur",
          "La connaissance des moyens productiques serait un plus",
        ],
      },
    ],
  },
  {
    id: "controleur-qualite",
    title: "Contrôleur qualité",
    location: "Bamako, Mali",
    contract: "",
    remote: false,
    published: "2023-05-17",
    domain: "Qualité",
    summary: "Responsable du produit fini par rapport au cahier des charges : vérifier et attester la conformité des pièces fabriquées et assemblées.",
    sections: [
      {
        title: "Finalité du poste",
        text: "Responsable du produit fini par rapport au cahier des charges, il vérifie et atteste de la conformité des pièces fabriquées (et/ou assemblées) par rapport à la documentation technique.",
      },
      {
        title: "Missions principales",
        items: [
          "Contrôler la réception des matières premières et des produits sous-traités",
          "Effectuer des relevés de contrôle (aspect, dimensions…)",
          "Vérifier la conformité de la fabrication et des règles et procédures",
          "Effectuer les CND sur les pièces en cours de fabrication",
          "Proposer des actions correctives et préventives",
          "Rédiger les éventuels litiges de fabrication et remplir les documents de contrôle de conformité",
          "Isoler les produits non conformes ou suspects et suivre les réclamations associées",
          "Établir les Data Packs des affaires pendant les travaux et les DFA à la fin",
        ],
      },
      {
        title: "Compétences requises",
        items: [
          "Bac technique ou équivalent",
          "Certificat Cofrend ou ASNT niveau 2 minimum en ressuage",
          "5 ans d'expérience minimum en chaudronnerie et construction métallique",
          "Connaissance des matériaux, des techniques (usinage, fabrication, assemblage) et des processus de fabrication",
          "Connaissance des normes et techniques de contrôle qualité : métrologie, essais",
          "Application de processus stricts et respect de la confidentialité",
        ],
      },
    ],
  },
];
