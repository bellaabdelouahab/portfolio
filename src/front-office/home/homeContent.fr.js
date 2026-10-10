// French versions of the content in homeContent.js. Ids and numbers are shared
// with the English data; only text is replaced (see shared/i18n/useContent.js).

export const aboutFr = {
  title: "Développeur web et analyste de données",
  intro: "Abdelouahab Bella est développeur web et analyste de données freelance, basé à Agadir, au Maroc. Il crée des sites vitrines et des applications web, et transforme des données brutes en tableaux de bord et rapports que les équipes utilisent pour décider.",
  detailedIntro: "Titulaire d'un Master en Big Data et Business Intelligence, il a travaillé sur la migration de données à grande échelle, le reporting Power BI et des plateformes SaaS. Les clients disposent d'une seule personne capable de construire le produit puis d'en mesurer les résultats, de la première maquette au déploiement et au suivi.",
  skills: [
    "React, JavaScript, Django, FastAPI",
    "Docker, CI/CD, PostgreSQL, Linux",
    "SQL (avancé), Python (Pandas)",
    "Power BI, DAX, pipelines ETL",
    "GA4, Search Console, Microsoft Clarity",
    "SEO et performance web",
    "API REST et intégrations",
    "Communication client en français, anglais et arabe",
  ],
};

export const servicesFr = {
  web: {
    title: "Développement web",
    description: "Sites vitrines, boutiques en ligne, plateformes de réservation et de gestion, outils internes. WordPress ou Shopify pour un lancement rapide, un développement sur mesure avec Django ou Next.js quand il faut aller plus loin.",
    longDescription: "Sites vitrines, applications web et outils internes, pensés pour ceux qui les utilisent et conçus pour être maintenus. Le travail couvre l'interface, le serveur et la base de données, le déploiement sur un serveur que vous possédez, ainsi que les bases du SEO et de la performance qui décident si le site sera trouvé.",
    deliverables: [
      "Site web ou application responsive, testé sur mobile et ordinateur",
      "Serveur, base de données et espace d'administration utilisables sans développeur",
      "Déploiement sur votre domaine avec HTTPS, sauvegardes et supervision",
      "SEO de base, outils d'analyse et rapport de performance",
      "Code source, documentation et séance de passation",
    ],
    process: [
      ["Appel de découverte", "30 minutes pour définir objectifs, utilisateurs et périmètre. Gratuit."],
      ["Devis", "Périmètre, délai et prix en MAD sous deux jours ouvrés."],
      ["Réalisation", "Démonstrations chaque semaine sur un lien privé, sans mauvaise surprise."],
      ["Mise en ligne et suivi", "Déploiement, passation et un minimum de 7 jours de suivi après la mise en ligne inclus."],
    ],
    startingPrice: "Pages de présentation dès 3 000 MAD, applications dès 15 000 MAD",
    tiers: {
      landing: {
        name: "Page de présentation",
        audience: "Une page unique pour présenter une offre, un événement ou une activité et recevoir des demandes.",
        includes: ["WordPress ou un thème prêt à l'emploi, adapté à votre marque", "Formulaire de contact qui arrive dans votre boîte mail", "SEO de base et chargement rapide", "Adapté au mobile et à l'ordinateur"],
        duration: "2 à 5 jours",
        priceLabel: "À partir de 3 000 MAD",
        priceNote: "",
      },
      site: {
        name: "Site vitrine",
        audience: "Une entreprise qui veut un vrai site qu'elle peut modifier et faire évoluer.",
        includes: ["5 à 10 pages", "Un CMS que vous modifiez vous-même", "Français et anglais", "Bases du SEO", "Outils d'analyse installés"],
        duration: "2 à 4 semaines",
        priceLabel: "À partir de 6 000 MAD",
        priceNote: "En général de 6 000 à 10 000 MAD",
      },
      store: {
        name: "Boutique en ligne",
        audience: "Un commerce qui veut vendre en ligne et encaisser des paiements.",
        includes: ["WooCommerce ou Shopify", "Catalogue et import des produits", "Paiement, par exemple CMI", "Règles de livraison"],
        duration: "3 à 6 semaines",
        priceLabel: "À partir de 8 000 MAD",
        priceNote: "En général de 8 000 à 15 000 MAD",
      },
      app: {
        name: "Application web sur mesure",
        audience: "Un processus, une plateforme ou un outil interne qu'aucun modèle ne couvre.",
        includes: ["Comptes et rôles", "Base de données et espace d'administration", "Intégrations et tableaux de bord", "Développé avec Django, Next.js ou équivalent", "Une démonstration fonctionnelle chaque semaine"],
        duration: "4 semaines et plus",
        priceLabel: "À partir de 15 000 MAD",
        priceNote: "Devis sur mesure, en général de 15 000 à 40 000 MAD et plus",
      },
    },
    relatedSkills: [
      "WordPress et Shopify",
      "React, Next.js, Tailwind CSS",
      "Django, FastAPI, Node.js",
      "PostgreSQL, MongoDB, SQLite",
      "Docker, CI/CD, Nginx, Linux",
      "SEO et performance technique",
    ],
    buttonText: "Démarrer un projet",
    serviceType: "Développement web",
    seoTitle: "Création de site web à Agadir et au Maroc",
    seoDescription: "Développeur web freelance à Agadir : site vitrine, boutique en ligne WordPress ou Shopify, application sur mesure Django ou Next.js. Devis écrit en MAD.",
  },
  data: {
    title: "Analyse de données",
    description: "Tableaux de bord, rapports et pipelines de données qui répondent aux questions que votre équipe se pose chaque semaine. Power BI, SQL et Python, des exports désordonnés à un écran que l'on ouvre vraiment.",
    longDescription: "Tableaux de bord, rapports automatisés et pipelines de données pour les équipes qui travaillent encore avec des tableurs et des exports. Le travail couvre le nettoyage et la modélisation des données, la création du tableau de bord dans Power BI ou sur le web, et l'automatisation de l'actualisation pour que les chiffres soient à jour sans recopier de fichiers.",
    deliverables: [
      "Tableau de bord interactif (Power BI ou web) construit autour de vos décisions",
      "Modèle de données nettoyé, documenté, avec actualisation automatique",
      "Indicateurs (KPI) définis avec votre équipe et mis par écrit",
      "Suivi web et ventes avec GA4 et Search Console",
      "Séance de formation pour que votre équipe lise et fasse évoluer le tout",
    ],
    process: [
      ["Appel de découverte", "30 minutes sur les questions auxquelles vous voulez des réponses. Gratuit."],
      ["Revue des données", "Audit de vos sources, des problèmes de qualité et note de faisabilité."],
      ["Réalisation", "Modèle, tableau de bord et automatisation, validés avec vous à chaque étape."],
      ["Passation", "Documentation, formation et un minimum de 7 jours de suivi après la mise en ligne inclus."],
    ],
    startingPrice: "Analyse express dès 3 000 MAD, projets complets dès 15 000 MAD",
    tiers: {
      express: {
        name: "Analyse express",
        audience: "Vous avez un fichier, un export ou un tableur et il vous faut des réponses ou un classeur automatisé.",
        includes: [
          "Nettoyage et contrôle des données",
          "L'analyse, ou un fichier Excel ou Power BI automatisé",
          "Formules et étapes documentées pour que vous puissiez les réutiliser",
          "Une courte synthèse écrite des constats et de ce qu'ils changent pour vos décisions",
          "Un appel de restitution",
        ],
        note: "Des résultats vérifiés, portés par une personne responsable, et non une réponse ponctuelle de chatbot.",
        excludes: "le suivi continu",
        duration: "1 à 3 jours",
        priceLabel: "À partir de 3 000 MAD",
        priceNote: "",
      },
      dashboard: {
        name: "Tableau de bord et reporting",
        audience: "Les équipes qui font leur reporting à partir de tableurs et d'exports.",
        includes: [
          "Jusqu'à 3 sources de données et un modèle de données",
          "3 à 5 pages de rapport avec actualisation planifiée",
          "Indicateurs (KPI) définis avec vous",
          "Une séance de formation pour votre équipe",
          "7 jours de suivi après la mise en service",
        ],
        duration: "2 à 6 semaines",
        priceLabel: "À partir de 8 000 MAD",
        priceNote: "En général de 8 000 à 15 000 MAD",
      },
      platform: {
        name: "Plateforme de données",
        audience: "Données volumineuses ou complexes (de millions de lignes à des téraoctets), plusieurs systèmes, pipelines ou temps réel.",
        includes: [
          "Une courte phase de cadrage payante pour cartographier les données et convenir d'un plan",
          "Livraison par phases, avec une démonstration à chaque phase",
          "Pipelines et stockage avec des outils comme Spark, Kafka et RabbitMQ ou MQTT si nécessaire",
          "Entrepôt ou lac de données, tableaux de bord, supervision et documentation",
          "Un bilan de la valeur créée avec vous à 30, 60 et 90 jours après la mise en service",
        ],
        duration: "1 à 5 mois",
        priceLabel: "À partir de 15 000 MAD",
        priceNote: "Devis sur mesure, en général de 15 000 à 40 000 MAD et plus",
      },
    },
    relatedSkills: [
      "Power BI, DAX, automatisation Excel",
      "SQL (avancé), SQL Server, PostgreSQL",
      "Python (Pandas), automatisation ETL",
      "GA4, Search Console, Microsoft Clarity",
      "Machine learning et vision par ordinateur",
    ],
    buttonText: "Parler de vos données",
    serviceType: "Analyse de données et business intelligence",
    seoTitle: "Power BI et analyse de données au Maroc",
    seoDescription: "Analyste de données freelance au Maroc : tableaux de bord Power BI sur mesure, rapports Excel et SQL automatisés, pipelines Python. Devis écrit en MAD.",
  },
};

export const faqFr = {
  q1: ["Combien coûte la création d'un site web au Maroc ?", "Une page de présentation démarre à 3 000 MAD, un site vitrine à 6 000 MAD (en général de 6 000 à 10 000), une boutique en ligne à 8 000 MAD et une application web sur mesure à 15 000 MAD, selon le nombre de pages, les fonctionnalités et les intégrations. Ces montants sont indicatifs : vous recevez un devis écrit en MAD après un appel gratuit de 30 minutes."],
  q2: ["Combien coûte un tableau de bord Power BI ou un projet de données ?", "Une analyse express d'un fichier ou d'un tableur démarre à 3 000 MAD (1 à 3 jours). Un projet de tableau de bord et de reporting démarre à 8 000 MAD, en général de 8 000 à 15 000 MAD. Une plateforme de données pour des volumes importants ou complexes démarre à 15 000 MAD et se chiffre après une courte phase de cadrage payante, en général de 15 000 à 40 000 MAD et plus."],
  q3: ["Combien de temps prend un projet ?", "Une page de présentation prend quelques jours, un site vitrine deux à quatre semaines et un tableau de bord deux à six semaines. Les applications et plateformes de données plus importantes prennent un à cinq mois, planifiées par phases avec une démonstration chaque semaine ou chaque phase."],
  q4: ["Travaillez-vous avec des clients hors d'Agadir ?", "Oui. La plupart des projets se font à distance, avec des appels et un lien de prévisualisation partagé. Je travaille avec des clients partout au Maroc et à l'étranger, en français, en anglais et en arabe."],
  q4b: ["Êtes-vous une entreprise déclarée ? Émettez-vous des factures ?", "Oui. Je travaille en tant qu'auto-entrepreneur déclaré au Maroc. Vous recevez un devis écrit avant le début du travail et une facture officielle à la fin, et mes impôts sont déclarés : vous pouvez donc m'enregistrer comme fournisseur dans votre société."],
  q5: ["À qui appartiennent le code et les données ?", "À vous. Le code, la base de données et les tableaux de bord vous sont remis à la livraison, hébergés sur des comptes à votre nom, avec la documentation."],
  q6: ["Pouvez-vous améliorer un site existant ?", "Oui. Je propose des audits SEO et des revues techniques, avec une liste priorisée de corrections pour la vitesse, la visibilité sur les moteurs de recherche et la conversion."],
  q7: ["Proposez-vous du support après la mise en ligne ?", "Chaque projet inclut un minimum de 7 jours de suivi (hypercare) après la mise en ligne, dans le budget."],
};

const FR_MONTHS = { Jan: "janv.", Feb: "févr.", Mar: "mars", Apr: "avr.", May: "mai", Jun: "juin", Jul: "juil.", Aug: "août", Sep: "sept.", Oct: "oct.", Nov: "nov.", Dec: "déc." };
export const frDate = (s) =>
  s === "Present" ? "Aujourd'hui" : String(s).replace(/^([A-Z][a-z]{2}) (\d{4})$/, (_, m, y) => `${FR_MONTHS[m] || m} ${y}`);

// Same order as professionalExperience in homeContent.js.
export const experienceFr = [
  {
    title: "Auditeur du ROI digital (freelance)",
    description: "Auditeur indépendant du ROI digital : audits numériques gratuits pour des entreprises marocaines, afin de bâtir un portfolio d'études de cas et de résultats mesurables. S'appuie sur l'analyse web et le comportement des utilisateurs pour repérer les freins à la conversion, améliorer la visibilité locale et maximiser le retour sur investissement digital grâce à des recommandations concrètes.",
  },
  {
    title: "Consultant données et analytique [eVia Services]",
    description: "Analytique pour des plateformes d'entreprise dont SAP Ariba, SAP S/4HANA, Salesforce, ServiceNow et Oracle. Conception de tableaux de bord d'adoption, de modèles de ROI et de suivi du comportement des utilisateurs, avec coordination de parties prenantes multinationales tout au long de la livraison.",
  },
  {
    title: "Développeur Python et ingénieur automatisation (freelance)",
    description: "Développement Python et ingénierie d'automatisation en freelance : systèmes back-end, automatisation de flux ETL, pipelines CI/CD, API évolutives et migration de données pour des projets clients.",
  },
  {
    title: "Ingénieur données et architecte BI [COPAG]",
    description: "Contribution à un projet de migration de plus de 100 millions d'enregistrements depuis des systèmes hérités vers une plateforme moderne. Scripts d'automatisation ETL en Python avec validation et journalisation, participation à la mise en place du CI/CD et livraison d'analyses destinées à la direction.",
  },
  {
    title: "Développeur back-end et analyste web [Smart Maint]",
    description: "Développement et déploiement d'une plateforme SaaS utilisée par plus de 50 personnes avec Django et FastAPI. Pipelines CI/CD pour des déploiements sans interruption, supervision de l'infrastructure et optimisation SEO ayant mené aux premières positions de Google sur les mots-clés visés.",
  },
  {
    title: "Ingénieur full stack [NidInnovation]",
    description: "Conception et livraison du site vitrine et de la plateforme digitale de NidInnovation, présentant ses services et ses offres, avec une architecture full stack évolutive et des interfaces responsives.",
  },
  {
    title: "Système de parking intelligent [AGRI 4.0]",
    description: "Développement d'une solution de vision par ordinateur de qualité production pour un projet de parking intelligent financé par l'État : détection en temps réel des places avec 99 % de précision, ayant contribué à l'obtention d'un financement complémentaire grâce au traitement d'images avancé.",
  },
  {
    title: "Site CRJEA : centre de référence pour jeunes entrepreneurs [UM6P et CRJEA]",
    description: "Développement d'une plateforme multi-administrateurs de gestion des projets et des bénéficiaires pour de jeunes entrepreneurs et des coopératives agricoles. Intégration d'API REST et de fonctionnalités côté client pour l'échange de données et la gestion des utilisateurs.",
  },
  {
    title: "E-Khsab : système connecté de suivi des bovins [AGRI 4.0]",
    description: "Solutions d'analyse IoT pour l'élevage : suivi en temps réel du bétail, planification de l'insémination artificielle et détection des chaleurs. La plateforme a automatisé les flux de suivi de reproduction et de santé, réduit les interventions manuelles et permis des analyses prédictives sur plusieurs sites d'élevage.",
  },
];
