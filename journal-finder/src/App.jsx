import { useState, useMemo } from 'react';
import {
  BarChart3, BookOpen, Info,
  ExternalLink, TrendingUp,
  Hash, Layers, Play, Lightbulb, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';

// Journal-Datenbank (Impact Factors: JCR 2023; VHB: JOURQUAL 3, 2015)
// Trait-Werte: 0.8 = hoch, 0.5 = mittel, 0.3 = niedrig
// Basierend auf Aims & Scope, Author Guidelines und Publikationsmustern 2023-2025
const JOURNAL_DATABASE = [
  {
    id: 1, name: "Journal of Personality and Social Psychology (JPSP)",
    url: "https://www.apa.org/pubs/journals/psp",
    impactFactor: 6.4, jcrYear: 2023, vhb: "A", category: "Personality",
    traits: { multiStudy: 0.8, twoStudy: 0.5, singleStudy: 0.3, metaAnalysis: 0.3, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.8, panel: 0.3, esm: 0.5, network: 0.3, sem: 0.5, cfa: 0.3, regression: 0.5, plsSem: 0.3, multilevel: 0.8, irt: 0.3, qualitative: 0.3 },
    details: { method: "Experimental / Multi-Study / Multi-Level", policy: "Multi-study packages strongly preferred. Theory contribution must be groundbreaking. PPID section more open to correlational designs.",
      framingTip: "Frame als grundlegenden Theoriebeitrag mit klar abgeleiteten Hypothesen. Mindestens 3 Studien mit konvergierender Evidenz. Betone den Beitrag zur psychologischen Theorie, nicht nur empirische Ergebnisse." },
    tags: ["personality", "social", "motivation", "well-being", "theory", "fwb", "financial", "self", "emotion", "attitudes", "cognition", "behavior", "intergroup"]
  },
  {
    id: 2, name: "Psychological Assessment",
    url: "https://www.apa.org/pubs/journals/pas",
    impactFactor: 3.7, jcrYear: 2023, vhb: "B", category: "Assessment",
    traits: { multiStudy: 0.5, twoStudy: 0.8, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.3, panel: 0.3, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.5, plsSem: 0.3, multilevel: 0.5, irt: 0.8, qualitative: 0.3 },
    details: { method: "CFA / SEM / Network Analysis / IRT", policy: "CFA is the bread-and-butter method. Excellent for nomological networks & validation. Single-study with 1-2 samples is standard.",
      framingTip: "Stelle die psychometrische Qualität in den Vordergrund: Faktorstruktur, Reliabilität, konvergente/diskriminante Validität. Nutze mindestens eine CFA und berichte Measurement Invariance wenn möglich." },
    tags: ["assessment", "validity", "scales", "network", "psychometrics", "nomological", "validation", "clinical", "measurement", "reliability"]
  },
  {
    id: 3, name: "Journal of Business Research (JBR)",
    url: "https://www.sciencedirect.com/journal/journal-of-business-research",
    impactFactor: 10.5, jcrYear: 2023, vhb: "B", category: "Business",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.5, panel: 0.3, esm: 0.3, network: 0.3, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.8, multilevel: 0.5, irt: 0.3, qualitative: 0.5 },
    details: { method: "PLS-SEM / CB-SEM / Experimental", policy: "PLS-SEM dominant method. Single-study with cross-sectional survey is standard. Dedicated PLS-SEM special issue (2024).",
      framingTip: "Betone die Praxisrelevanz und Managementimplikationen. Nutze PLS-SEM oder CB-SEM. Formuliere klare 'managerial implications' am Ende. Internationale Stichproben sind ein Plus." },
    tags: ["consumer", "marketing", "business", "well-being", "management", "financial", "strategy", "innovation", "organizational", "sustainability", "entrepreneurship"]
  },
  {
    id: 4, name: "Journal of Happiness Studies",
    url: "https://link.springer.com/journal/10902",
    impactFactor: 3.7, jcrYear: 2023, vhb: "C", category: "Well-being",
    traits: { multiStudy: 0.3, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.8, longitudinal: 0.5, experimental: 0.3, panel: 0.5, esm: 0.5, network: 0.3, sem: 0.8, cfa: 0.5, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.5 },
    details: { method: "SEM / Regression / Path Analysis", policy: "The standard for well-being and life satisfaction research. Single-study is the norm. SEM for mediation models very common.",
      framingTip: "Verankere das Paper in der Well-being-Literatur (Diener, Ryan & Deci). Nutze etablierte Well-being-Maße (SWLS, PANAS, WHO-5). Mediationsmodelle via SEM sind ideal." },
    tags: ["happiness", "well-being", "positive-psychology", "quality-of-life", "subjective", "financial", "life-satisfaction", "flourishing", "eudaimonic", "hedonic"]
  },
  {
    id: 5, name: "European Journal of Psychological Assessment (EJPA)",
    url: "https://econtent.hogrefe.com/journal/ejpa",
    impactFactor: 2.8, jcrYear: 2023, vhb: "C", category: "Assessment",
    traits: { multiStudy: 0.5, twoStudy: 0.8, singleStudy: 0.8, metaAnalysis: 0.3, mixedMethods: 0.3, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.3, panel: 0.3, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.5, plsSem: 0.3, multilevel: 0.5, irt: 0.8, qualitative: 0.3 },
    details: { method: "CFA / Measurement Invariance / Network / IRT", policy: "Multistudy Reports are an explicit article type. Prioritizes new measures or advancements of existing measures.",
      framingTip: "Fokussiere auf Skalenentwicklung oder -weiterentwicklung. Measurement Invariance über Gruppen/Kulturen ist ein Alleinstellungsmerkmal. Vermeide reine Übersetzungsstudien ohne neue Erkenntnisse." },
    tags: ["assessment", "measurement", "cross-cultural", "network", "psychometrics", "validation", "invariance", "reliability"]
  },
  {
    id: 6, name: "Personality and Individual Differences (PAID)",
    url: "https://www.sciencedirect.com/journal/personality-and-individual-differences",
    impactFactor: 3.5, jcrYear: 2023, vhb: "C", category: "Personality",
    traits: { multiStudy: 0.3, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.3, panel: 0.3, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.5, qualitative: 0.3 },
    details: { method: "SEM / CFA / Network Analysis / Regression", policy: "Single-study with cross-sectional data is standard. Growing number of network papers. Fast turnaround.",
      framingTip: "Positioniere als Beitrag zu individuellen Unterschieden. Eine cross-sektionale Studie mit N>250 reicht. Network-Analysen und Persönlichkeits-Korrelate sind willkommen. Kurze Artikel (6000-8000 Wörter)." },
    tags: ["personality", "traits", "individual-differences", "fwb", "network", "well-being", "dark-triad", "intelligence", "self-esteem", "emotion-regulation"]
  },
  {
    id: 7, name: "Assessment",
    url: "https://journals.sagepub.com/home/asm",
    impactFactor: 3.5, jcrYear: 2023, vhb: "B", category: "Assessment",
    traits: { multiStudy: 0.5, twoStudy: 0.8, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.3, panel: 0.3, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.5, plsSem: 0.3, multilevel: 0.5, irt: 0.8, qualitative: 0.3 },
    details: { method: "CFA / Scale Development / Network / IRT", policy: "Development + validation sample (2-study) common. Longitudinal test-retest welcome. Network psychometrics and IRT growing.",
      framingTip: "Ideal für Development-Sample + Validation-Sample Design. Berichte Test-Retest-Reliabilität wenn möglich. Klinische und Persönlichkeits-Assessment-Relevanz betonen." },
    tags: ["assessment", "measurement", "clinical", "scales", "psychometrics", "diagnostic", "personality", "validity"]
  },
  {
    id: 8, name: "Journal of Consumer Affairs",
    url: "https://onlinelibrary.wiley.com/journal/17456606",
    impactFactor: 3.0, jcrYear: 2023, vhb: "B", category: "Consumer",
    traits: { multiStudy: 0.3, twoStudy: 0.3, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.8, esm: 0.3, network: 0.3, sem: 0.5, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.5 },
    details: { method: "Regression / Econometric / SEM / Panel", policy: "Policy-oriented; panel data and longitudinal surveys valued. Econometric methods (OLS, IV, DiD) alongside SEM.",
      framingTip: "Frame als Policy-relevante Forschung. Nutze Sekundärdaten (SCF, PSID, SOEP) wenn möglich. Betone Implikationen für Verbraucherschutz und Financial Literacy. Ökonometrische Methoden bevorzugt." },
    tags: ["consumer", "financial", "fwb", "well-being", "policy", "household", "debt", "literacy", "protection", "vulnerability"]
  },
  {
    id: 9, name: "Journal of Economic Psychology",
    url: "https://www.sciencedirect.com/journal/journal-of-economic-psychology",
    impactFactor: 2.8, jcrYear: 2023, vhb: "B", category: "Economics",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.8, panel: 0.5, esm: 0.3, network: 0.3, sem: 0.5, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.3 },
    details: { method: "Experimental / Regression / SEM", policy: "Methodologically flexible. Genuine mix of experiments, surveys, and panel data. Values causal identification.",
      framingTip: "Verknüpfe Psychologie mit ökonomischem Verhalten. Kausale Identifikation betonen (Experimente, IV, DiD). Behavioral-Economics-Framing (Kahneman, Thaler) stärkt das Paper." },
    tags: ["economic", "financial", "fwb", "decision-making", "behavior", "well-being", "saving", "nudging", "behavioral-economics", "tax"]
  },
  {
    id: 10, name: "Journal of Consumer Psychology",
    url: "https://myscp.onlinelibrary.wiley.com/journal/15327663",
    impactFactor: 4.0, jcrYear: 2023, vhb: "A", category: "Consumer",
    traits: { multiStudy: 0.8, twoStudy: 0.5, singleStudy: 0.3, metaAnalysis: 0.3, mixedMethods: 0.3, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.8, panel: 0.3, esm: 0.3, network: 0.3, sem: 0.3, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.3, irt: 0.3, qualitative: 0.3 },
    details: { method: "Experimental / PROCESS Macro / ANOVA", policy: "3-5 converging experiments expected. Strong internal validity focus. Hayes PROCESS for mediation far more common than latent-variable SEM.",
      framingTip: "Baue 3-5 saubere Experimente mit klarer interner Validität. Nutze PROCESS Macro für Mediation/Moderation. Jede Studie muss einen spezifischen Aspekt der Theorie testen." },
    tags: ["consumer", "psychology", "financial", "decision-making", "motivation", "well-being", "persuasion", "judgment", "attitudes", "branding"]
  },
  {
    id: 11, name: "Psychological Methods",
    url: "https://www.apa.org/pubs/journals/met",
    impactFactor: 7.1, jcrYear: 2023, vhb: "A", category: "Methods",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.8, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.5, network: 0.8, sem: 0.8, cfa: 0.5, regression: 0.5, plsSem: 0.3, multilevel: 0.8, irt: 0.8, qualitative: 0.3 },
    details: { method: "Network Modeling / SEM / IRT / Meta-Analysis", policy: "Methodological innovation required. Data type agnostic. Premier outlet for network psychometrics and advanced methods.",
      framingTip: "Der Beitrag muss methodisch innovativ sein — nicht nur eine Anwendung. Zeige, dass deine Methode ein bestehendes Problem löst. Simulation + empirische Illustration ist das Standardformat." },
    tags: ["methods", "statistics", "network", "sem", "psychometrics", "modeling", "simulation", "meta-analysis", "bayesian", "replication"]
  },
  {
    id: 12, name: "Multivariate Behavioral Research",
    url: "https://www.tandfonline.com/journals/hmbr20",
    impactFactor: 3.7, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.5, network: 0.8, sem: 0.8, cfa: 0.8, regression: 0.5, plsSem: 0.3, multilevel: 0.8, irt: 0.8, qualitative: 0.3 },
    details: { method: "Network / SEM / CFA / Multilevel / IRT", policy: "Flagship methods journal. Data type agnostic. Foundational network, SEM, and CFA methodology papers.",
      framingTip: "Fokussiere auf methodische Weiterentwicklung multivariater Verfahren. Monte-Carlo-Simulationen zur Evaluation sind Standard. Empirische Illustration mit realen Daten ergänzen." },
    tags: ["methods", "statistics", "network", "sem", "longitudinal", "modeling", "multivariate", "latent", "growth-curve", "mixture"]
  },
  {
    id: 13, name: "European Journal of Personality",
    url: "https://journals.sagepub.com/home/erp",
    impactFactor: 4.2, jcrYear: 2023, vhb: "B", category: "Personality",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.8, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.3, multilevel: 0.8, irt: 0.5, qualitative: 0.3 },
    details: { method: "SEM / CFA / Network / Longitudinal / ESM", policy: "Values longitudinal, ESM, and diary designs for personality processes. Multi-study for replicability. Network approaches growing.",
      framingTip: "Frame als Beitrag zu Persönlichkeitsprozessen und -dynamiken. ESM/Diary-Daten oder Längsschnitt-Designs sind ein starkes Plus. Registered Reports werden unterstützt." },
    tags: ["personality", "traits", "network", "assessment", "individual-differences", "well-being", "development", "dynamics", "diary", "processes"]
  },
  {
    id: 14, name: "Frontiers in Psychology",
    url: "https://www.frontiersin.org/journals/psychology",
    impactFactor: 2.6, jcrYear: 2023, vhb: "C", category: "General",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.8, crossSectional: 0.8, longitudinal: 0.5, experimental: 0.8, panel: 0.5, esm: 0.5, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.5, multilevel: 0.5, irt: 0.5, qualitative: 0.8 },
    details: { method: "Diverse (SEM, CFA, Network, Regression, Qualitative)", policy: "Open Access mega-journal. No design or method preference. High volume, broad scope. Quant. Psych. section welcomes psychometric methods.",
      framingTip: "Wähle die passende Section (z.B. Quantitative Psychology, Health Psychology). Solide empirische Arbeit reicht — keine bahnbrechende Innovation nötig. Open-Access-Gebühren einplanen." },
    tags: ["general", "well-being", "personality", "assessment", "financial", "fwb", "open-access", "clinical", "cognitive", "developmental", "organizational", "health"]
  },
  {
    id: 15, name: "International Journal of Consumer Studies",
    url: "https://onlinelibrary.wiley.com/journal/14706431",
    impactFactor: 8.6, jcrYear: 2023, vhb: "C", category: "Consumer",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.5, panel: 0.3, esm: 0.3, network: 0.3, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.8, multilevel: 0.3, irt: 0.3, qualitative: 0.5 },
    details: { method: "PLS-SEM / CB-SEM / Survey", policy: "Cross-sectional survey with SEM is standard. Two-step approach (CFA then SEM) dominates. International perspective valued.",
      framingTip: "Nutze den Two-Step-Approach (CFA → Strukturmodell). Internationale oder cross-kulturelle Stichproben sind ein Plus. PLS-SEM ist hier besonders willkommen." },
    tags: ["consumer", "financial", "fwb", "well-being", "international", "behavior", "household", "sustainability", "food", "digital"]
  },
  {
    id: 16, name: "Social Indicators Research",
    url: "https://link.springer.com/journal/11205",
    impactFactor: 3.1, jcrYear: 2023, vhb: "B", category: "Well-being",
    traits: { multiStudy: 0.3, twoStudy: 0.3, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.8, longitudinal: 0.5, experimental: 0.3, panel: 0.8, esm: 0.3, network: 0.3, sem: 0.8, cfa: 0.5, regression: 0.8, plsSem: 0.3, multilevel: 0.8, irt: 0.3, qualitative: 0.5 },
    details: { method: "SEM / Regression / Multilevel / Panel", policy: "Broad well-being and quality-of-life scope. Cross-national and panel studies valued. SEM and regression dominant.",
      framingTip: "Cross-nationale Vergleiche und soziale Indikatoren betonen. Nutze Panel-Daten (SOEP, ESS, WVS) wenn möglich. Multilevel-Modelle für Ländervergleiche ideal." },
    tags: ["well-being", "quality-of-life", "social", "indicators", "financial", "fwb", "cross-cultural", "inequality", "poverty", "policy"]
  },
  {
    id: 17, name: "Journal of Research in Personality",
    url: "https://www.sciencedirect.com/journal/journal-of-research-in-personality",
    impactFactor: 2.8, jcrYear: 2023, vhb: "B", category: "Personality",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.8, experimental: 0.5, panel: 0.5, esm: 0.8, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.3, multilevel: 0.8, irt: 0.5, qualitative: 0.3 },
    details: { method: "SEM / CFA / Longitudinal / Network / ESM", policy: "Strong tradition of longitudinal and ESM personality research. Values personality dynamics and processes.",
      framingTip: "Längsschnitt- oder ESM-Daten sind hier besonders stark. Frame als Persönlichkeitsdynamik oder -entwicklung. Große Stichproben (N>400) und robuste Designs erwünscht." },
    tags: ["personality", "traits", "individual-differences", "well-being", "longitudinal", "assessment", "development", "goals", "identity", "narratives"]
  },
  {
    id: 18, name: "Journal of Behavioral and Experimental Finance",
    url: "https://www.sciencedirect.com/journal/journal-of-behavioral-and-experimental-finance",
    impactFactor: 4.3, jcrYear: 2023, vhb: "C", category: "Finance",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.8, longitudinal: 0.5, experimental: 0.8, panel: 0.5, esm: 0.3, network: 0.3, sem: 0.5, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.3 },
    details: { method: "Experimental / Regression / SEM", policy: "Behavioral finance meets psychology. Financial decision-making and financial literacy focus. Experiments and surveys both accepted.",
      framingTip: "Verbinde psychologische Konstrukte mit Finanzverhalten. Experimentelle Designs oder Survey-Daten zu Finanzentscheidungen. Behavioral-Finance-Literatur als Rahmen nutzen." },
    tags: ["financial", "fwb", "behavioral", "finance", "decision-making", "literacy", "experimental", "investment", "risk", "stock-market"]
  },
  {
    id: 19, name: "Journal of Family and Economic Issues",
    url: "https://link.springer.com/journal/10834",
    impactFactor: 2.4, jcrYear: 2023, vhb: "C", category: "Economics",
    traits: { multiStudy: 0.3, twoStudy: 0.3, singleStudy: 0.8, metaAnalysis: 0.3, mixedMethods: 0.5, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.3, panel: 0.8, esm: 0.3, network: 0.3, sem: 0.8, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.5 },
    details: { method: "SEM / Regression / Panel Data", policy: "Family financial well-being focus. Publishes FWB, financial stress, and economic hardship research. Panel surveys valued.",
      framingTip: "Verbinde finanzielle Themen mit dem Familienkontext (Stress, Erziehung, Partnerschaft). Panel-Daten (NLSY, PSID, SOEP) sind ideal. Praxisimplikationen für Familienberatung einbauen." },
    tags: ["family", "financial", "fwb", "well-being", "economic", "stress", "household", "parenting", "marriage", "work-family"]
  },
  {
    id: 20, name: "Behavior Research Methods",
    url: "https://link.springer.com/journal/13428",
    impactFactor: 4.6, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.5, network: 0.8, sem: 0.8, cfa: 0.5, regression: 0.5, plsSem: 0.3, multilevel: 0.5, irt: 0.8, qualitative: 0.3 },
    details: { method: "Network / SEM / IRT / Software Tutorials", policy: "Methods and tools for behavioral research. Software tutorials (R packages) highly valued. Network and SEM tool papers common.",
      framingTip: "Ideal wenn du ein R-Package oder Software-Tool vorstellst. Tutorial-Artikel mit anwendbarem Code sind sehr gefragt. Auch methodische Vergleichsstudien passen gut." },
    tags: ["methods", "statistics", "network", "software", "modeling", "psychometrics", "tools", "eye-tracking", "reaction-time", "experimental"]
  },
  {
    id: 21, name: "Structural Equation Modeling",
    url: "https://www.tandfonline.com/journals/hsem20",
    impactFactor: 2.4, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.5, metaAnalysis: 0.5, mixedMethods: 0.3, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.5, plsSem: 0.5, multilevel: 0.8, irt: 0.5, qualitative: 0.3 },
    details: { method: "SEM / CFA / Measurement Invariance / Multilevel", policy: "The dedicated SEM journal. Methodological SEM advances and substantive applications. CFA methodology central.",
      framingTip: "Entweder methodische SEM-Innovation oder eine substanzielle Anwendung, die SEM-spezifische Fragen adressiert. Measurement Invariance, Mediationsanalyse oder Modellvergleiche sind ideal." },
    tags: ["sem", "methods", "statistics", "cfa", "measurement", "invariance", "modeling", "latent", "mediation", "moderation"]
  },
  {
    id: 22, name: "Current Psychology",
    url: "https://link.springer.com/journal/12144",
    impactFactor: 2.5, jcrYear: 2023, vhb: "C", category: "General",
    traits: { multiStudy: 0.3, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.5, crossSectional: 0.8, longitudinal: 0.3, experimental: 0.5, panel: 0.3, esm: 0.3, network: 0.5, sem: 0.8, cfa: 0.8, regression: 0.8, plsSem: 0.5, multilevel: 0.5, irt: 0.3, qualitative: 0.5 },
    details: { method: "SEM / CFA / Network / Regression", policy: "Broad psychology scope. High volume, relatively fast review. Accepts network, SEM, and CFA papers across topics.",
      framingTip: "Guter Einstieg für erste Publikationen. Cross-sektionales Design mit SEM/CFA reicht. Breites Themenspektrum — Paper muss nicht hochspezialisiert sein. Schneller Review-Prozess." },
    tags: ["general", "well-being", "personality", "fwb", "financial", "network", "assessment", "anxiety", "depression", "resilience", "stress"]
  },
  {
    id: 23, name: "Applied Psychology: An International Review",
    url: "https://iaap-journals.onlinelibrary.wiley.com/journal/14640597",
    impactFactor: 4.9, jcrYear: 2023, vhb: "B", category: "Applied",
    traits: { multiStudy: 0.5, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.8, mixedMethods: 0.5, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.5, network: 0.3, sem: 0.8, cfa: 0.5, regression: 0.8, plsSem: 0.3, multilevel: 0.8, irt: 0.3, qualitative: 0.5 },
    details: { method: "SEM / Regression / Multilevel / Meta-Analysis", policy: "Applied psychology across work, health, and consumer domains. International samples valued. Meta-analyses welcome.",
      framingTip: "Betone die angewandte Relevanz — wie hilft die Forschung in der Praxis? Internationale Stichproben sind ein Muss. Meta-Analysen und Multilevel-Designs besonders willkommen." },
    tags: ["applied", "well-being", "work", "health", "financial", "cross-cultural", "consumer", "organizational", "occupational", "clinical"]
  },
  {
    id: 24, name: "Journal of Financial Counseling and Planning",
    url: "https://connect.springerpub.com/content/sgrjfcp",
    impactFactor: 1.8, jcrYear: 2023, vhb: "C", category: "Finance",
    traits: { multiStudy: 0.3, twoStudy: 0.3, singleStudy: 0.8, metaAnalysis: 0.3, mixedMethods: 0.5, crossSectional: 0.5, longitudinal: 0.5, experimental: 0.3, panel: 0.5, esm: 0.3, network: 0.3, sem: 0.5, cfa: 0.3, regression: 0.8, plsSem: 0.3, multilevel: 0.3, irt: 0.3, qualitative: 0.5 },
    details: { method: "Regression / SEM / Survey / Qualitative", policy: "Core FWB journal. Financial counseling, planning, and well-being. Practitioner-relevant research valued.",
      framingTip: "Starker Praxisbezug nötig — was bedeuten die Ergebnisse für Finanzberater? Qualitative oder Mixed-Methods-Ansätze willkommen. Auch kleinere Stichproben akzeptiert." },
    tags: ["financial", "fwb", "well-being", "counseling", "planning", "literacy", "household", "retirement", "debt", "budgeting"]
  },
  {
    id: 25, name: "International Journal of Wellbeing",
    url: "https://www.internationaljournalofwellbeing.org",
    impactFactor: 2.0, jcrYear: 2023, vhb: "C", category: "Well-being",
    traits: { multiStudy: 0.3, twoStudy: 0.5, singleStudy: 0.8, metaAnalysis: 0.5, mixedMethods: 0.8, crossSectional: 0.8, longitudinal: 0.5, experimental: 0.5, panel: 0.5, esm: 0.3, network: 0.3, sem: 0.8, cfa: 0.5, regression: 0.8, plsSem: 0.3, multilevel: 0.5, irt: 0.3, qualitative: 0.8 },
    details: { method: "SEM / Regression / Mixed Methods / Qualitative", policy: "Open access. Dedicated to well-being research across domains. Interdisciplinary and qualitative approaches welcome.",
      framingTip: "Interdisziplinäres Framing stärkt das Paper. Qualitative oder Mixed-Methods-Ansätze sind ein Alleinstellungsmerkmal. Open Access ohne Gebühren — ideal für Sichtbarkeit." },
    tags: ["well-being", "happiness", "fwb", "financial", "positive-psychology", "quality-of-life", "open-access", "flourishing", "meaning", "community"]
  }
];

// Geschätzte Verteilung der Datenarten pro Journal (basierend auf Publikationsmustern 2023-2025)
// Werte in Prozent, summieren sich auf ~100%
const DATA_PROFILES = {
  1:  { "Cross-Sectional": 28, "Experimental": 45, "Longitudinal": 12, "Panel": 4, "ESM/Diary": 6, "Andere": 5 },
  2:  { "Cross-Sectional": 60, "Longitudinal": 17, "Experimental": 6, "Panel": 4, "ESM/Diary": 3, "Andere": 10 },
  3:  { "Cross-Sectional": 50, "Experimental": 25, "Longitudinal": 7, "Panel": 6, "ESM/Diary": 1, "Andere": 11 },
  4:  { "Cross-Sectional": 55, "Longitudinal": 17, "Experimental": 7, "Panel": 12, "ESM/Diary": 4, "Andere": 5 },
  5:  { "Cross-Sectional": 65, "Longitudinal": 12, "Experimental": 4, "Panel": 2, "ESM/Diary": 3, "Andere": 14 },
  6:  { "Cross-Sectional": 60, "Experimental": 17, "Longitudinal": 7, "Panel": 3, "ESM/Diary": 4, "Andere": 9 },
  7:  { "Cross-Sectional": 60, "Longitudinal": 17, "Experimental": 4, "Panel": 3, "ESM/Diary": 5, "Andere": 11 },
  8:  { "Cross-Sectional": 35, "Longitudinal": 15, "Experimental": 15, "Panel": 10, "ESM/Diary": 0, "Andere": 25 },
  9:  { "Cross-Sectional": 10, "Experimental": 55, "Meta-Analyse": 20, "Longitudinal": 5, "ESM/Diary": 0, "Andere": 10 },
  10: { "Experimental": 65, "Cross-Sectional": 10, "Review/Konzept": 20, "Longitudinal": 3, "ESM/Diary": 0, "Andere": 2 },
  11: { "Simulation": 40, "Tutorial/Methodik": 25, "Meta-Analyse": 15, "Empirisch": 10, "Review": 10 },
  12: { "Simulation": 45, "Tutorial/Methodik": 20, "Empirisch (longitudinal)": 15, "Empirisch (cross-sect.)": 10, "Review": 10 },
  13: { "Longitudinal": 40, "Cross-Sectional": 15, "ESM/Diary": 15, "Meta-Analyse": 10, "Psychometrie": 10, "Andere": 10 },
  14: { "Cross-Sectional": 50, "Experimental": 20, "Review": 10, "Longitudinal": 5, "Skalenvalidierung": 5, "Andere": 10 },
  15: { "Cross-Sectional": 52, "Experimental": 22, "Longitudinal": 8, "Panel": 5, "Andere": 13 },
  16: { "Cross-Sectional": 37, "Panel": 27, "Longitudinal": 18, "Experimental": 3, "Andere": 15 },
  17: { "Longitudinal": 30, "Cross-Sectional": 27, "ESM/Diary": 12, "Experimental": 12, "Andere": 19 },
  18: { "Experimental": 45, "Cross-Sectional": 18, "Panel": 17, "Longitudinal": 8, "Andere": 12 },
  19: { "Cross-Sectional": 37, "Panel": 27, "Longitudinal": 18, "Experimental": 3, "Andere": 15 },
  20: { "Simulation/Tools": 50, "Experimental": 27, "Cross-Sectional": 12, "Andere": 11 },
  21: { "Simulation/Methodik": 60, "Cross-Sectional": 12, "Longitudinal": 12, "Andere": 16 },
  22: { "Cross-Sectional": 65, "Experimental": 12, "Longitudinal": 8, "Andere": 15 },
  23: { "Cross-Sectional": 37, "Longitudinal": 22, "Experimental": 12, "ESM/Diary": 8, "Andere": 21 },
  24: { "Cross-Sectional": 55, "Panel": 17, "Longitudinal": 12, "Experimental": 6, "Andere": 10 },
  25: { "Cross-Sectional": 50, "Longitudinal": 12, "Experimental": 12, "Andere": 26 },
};

const TRAIT_MAP = {
  design: {
    "Multi-Study (3+)": "multiStudy",
    "Two-Study (Dev + Val)": "twoStudy",
    "Single-Study": "singleStudy",
    "Meta-Analysis": "metaAnalysis",
    "Mixed Methods": "mixedMethods"
  },
  method: {
    "Network Modeling": "network",
    "SEM / Path Analysis": "sem",
    "CFA / Measurement": "cfa",
    "Regression / ANOVA": "regression",
    "PLS-SEM": "plsSem",
    "Multilevel / HLM": "multilevel",
    "IRT": "irt",
    "Qualitative": "qualitative"
  },
  dataType: {
    "Cross-Sectional": "crossSectional",
    "Longitudinal": "longitudinal",
    "Experimental": "experimental",
    "Panel Data": "panel",
    "Experience Sampling / Diary": "esm"
  }
};

// Designs where more rigor is never a disadvantage
const RIGOROUS_DESIGNS = ["Multi-Study (3+)", "Two-Study (Dev + Val)"];

function getFitColor(score) {
  if (score >= 70) return { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 40) return { bar: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50" };
  return { bar: "bg-red-400", text: "text-red-500", bg: "bg-red-50" };
}

export default function App() {
  const [kw1, setKw1] = useState("");
  const [kw2, setKw2] = useState("");
  const [kw3, setKw3] = useState("");
  const [design, setDesign] = useState("Single-Study");
  const [method, setMethod] = useState("SEM / Path Analysis");
  const [dataType, setDataType] = useState("Cross-Sectional");

  const [appliedCriteria, setAppliedCriteria] = useState(null);

  const handleSearch = () => {
    setAppliedCriteria({
      keywords: [kw1, kw2, kw3].map(k => k.trim().toLowerCase()).filter(k => k !== ""),
      design,
      method,
      dataType
    });
  };

  const results = useMemo(() => {
    if (!appliedCriteria) return [];

    const { keywords, design: appliedDesign, method: appliedMethod, dataType: appliedDataType } = appliedCriteria;
    const designTrait = TRAIT_MAP.design[appliedDesign];
    const methodTrait = TRAIT_MAP.method[appliedMethod];
    const dataTrait = TRAIT_MAP.dataType[appliedDataType];

    return JOURNAL_DATABASE.map(journal => {
      // 1. Topic Fit
      let keywordMatches = 0;
      keywords.forEach(kw => {
        const normKw = kw.replace(/-/g, ' ');
        const hasMatch = journal.tags.some(tag => {
          const normTag = tag.replace(/-/g, ' ');
          return normTag.includes(normKw) || normKw.includes(normTag);
        }) || journal.name.toLowerCase().includes(normKw);
        if (hasMatch) keywordMatches++;
      });
      const topicScore = keywords.length > 0 ? (keywordMatches / keywords.length) * 100 : 50;

      // 2. Design Fit -- asymmetrisch: Multi-Study/Two-Study ist nie ein Nachteil
      let designScore;
      if (RIGOROUS_DESIGNS.includes(appliedDesign)) {
        designScore = Math.max(journal.traits[designTrait] ?? 0.5, 0.5) * 100;
      } else {
        designScore = (journal.traits[designTrait] ?? 0.5) * 100;
      }

      // 3. Method + Data Fit
      const methodScore = (journal.traits[methodTrait] ?? 0.5) * 100;
      const dataScore = (journal.traits[dataTrait] ?? 0.5) * 100;

      const totalScore = Math.round((topicScore * 0.35) + (designScore * 0.20) + (methodScore * 0.25) + (dataScore * 0.20));

      return { ...journal, scores: { topic: topicScore, design: designScore, method: methodScore, data: dataScore }, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [appliedCriteria]);

  const selectClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-indigo-950 text-white pt-16 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg">
              <BarChart3 size={28} />
            </div>
            <span className="font-bold tracking-widest text-indigo-300 uppercase text-xs">Research Engine Pro</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6">Journal Finder</h1>
          <p className="text-xl text-indigo-200/80 max-w-3xl leading-relaxed">
            Finde das passende Journal für dein Paper — basierend auf Thema, Design, Methode und Datenart.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-10 mb-12">
          {/* Keywords */}
          <div className="mb-8">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Hash size={14} className="text-indigo-500" /> Keywords (bis zu 3)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                value={kw1} onChange={(e) => setKw1(e.target.value)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm"
                placeholder="z.B. Well-being"
              />
              <input
                value={kw2} onChange={(e) => setKw2(e.target.value)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm"
                placeholder="z.B. Personality"
              />
              <input
                value={kw3} onChange={(e) => setKw3(e.target.value)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm"
                placeholder="z.B. Assessment"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} className="text-indigo-500" /> Forschungs-Design
              </label>
              <select value={design} onChange={(e) => setDesign(e.target.value)} className={selectClass}>
                {Object.keys(TRAIT_MAP.design).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-500" /> Analyse-Methode
              </label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className={selectClass}>
                {Object.keys(TRAIT_MAP.method).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-500" /> Datenart
              </label>
              <select value={dataType} onChange={(e) => setDataType(e.target.value)} className={selectClass}>
                {Object.keys(TRAIT_MAP.dataType).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center border-t border-slate-100 pt-6">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
            >
              <Play size={16} fill="currentColor" />
              Jetzt vergleichen
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <>
            <ScoreInfo />

            <p className="text-xs text-slate-400 text-center mb-6">
              {results.length} Journals gefunden &middot; Impact Factors: JCR 2023 &middot; Rankings: VHB-JOURQUAL 3
            </p>

            <div className="grid gap-8">
              {results.map(journal => {
                const totalColor = getFitColor(journal.totalScore);
                return (
                <div key={journal.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-all">
                  <div className={`lg:w-72 p-10 flex flex-col items-center justify-center border-r border-slate-100 ${totalColor.bg}`}>
                    <div className={`text-6xl font-black tracking-tighter ${totalColor.text}`}>{journal.totalScore}%</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Match Index</div>
                    <div className="mt-8 pt-8 border-t border-slate-200 w-full flex justify-around text-center">
                      <div>
                        <div className="text-lg font-black">{journal.impactFactor}</div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">IF {journal.jcrYear}</div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-indigo-600">{journal.vhb}</div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">VHB</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">{journal.category}</span>
                        <h3 className="text-3xl font-black text-slate-900">{journal.name}</h3>
                      </div>
                      <a href={journal.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-indigo-600 transition-colors" title="Journal Homepage">
                        <ExternalLink size={24} />
                      </a>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <FitStat label="Keywords" score={journal.scores.topic} />
                      <FitStat label="Design" score={journal.scores.design} />
                      <FitStat label="Methode" score={journal.scores.method} />
                      <DataFitStat score={journal.scores.data} profile={DATA_PROFILES[journal.id]} />
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-slate-600"><span className="font-bold text-slate-700">Editorial:</span> {journal.details.policy} <span className="text-slate-400">Methoden: {journal.details.method}.</span></p>
                      </div>
                      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-3">
                        <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-amber-900"><span className="font-bold">Framing-Tipp:</span> {journal.details.framingTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}

        {appliedCriteria === null && (
          <div className="text-center py-20 text-slate-400">
            <BarChart3 size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-bold">Gib deine Suchkriterien ein und klicke "Jetzt vergleichen"</p>
            <p className="text-sm mt-2">Die Ergebnisse werden nach Match-Index sortiert angezeigt.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function FitStat({ label, score }) {
  const color = getFitColor(score);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-black ${color.text}`}>{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`${color.bar} h-full transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function DataFitStat({ score, profile }) {
  const color = getFitColor(score);
  const [open, setOpen] = useState(false);
  const sorted = profile ? Object.entries(profile).sort((a, b) => b[1] - a[1]) : [];
  const barColors = ["bg-indigo-500", "bg-indigo-400", "bg-indigo-300", "bg-slate-300", "bg-slate-200", "bg-slate-100"];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <button onClick={() => setOpen(!open)} className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-600 transition-colors">
          Datenart {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
        <span className={`text-xs font-black ${color.text}`}>{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`${color.bar} h-full transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
      {open && profile && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Publikationsprofil (geschätzt, 2023-2025)</p>
          <div className="space-y-1.5">
            {sorted.map(([type, pct], i) => (
              <div key={type} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-28 truncate">{type}</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${barColors[Math.min(i, barColors.length - 1)]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-slate-400 mt-2 italic">Basierend auf Editorial-Profil und Publikationsmustern. Keine exakte Auszählung.</p>
        </div>
      )}
    </div>
  );
}

function ScoreInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 mx-auto text-xs text-slate-400 hover:text-slate-600 transition-colors">
        <HelpCircle size={14} />
        <span className="font-bold">Wie werden die Scores berechnet?</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl mx-auto text-sm text-slate-600 space-y-3">
          <p className="font-bold text-slate-800">Match Index = gewichteter Durchschnitt aus 4 Dimensionen:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-indigo-600">35%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Keywords</div>
              <p className="text-[11px] mt-1">Anteil deiner Keywords, die in den Journal-Tags oder im Namen matchen.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-indigo-600">20%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Design</div>
              <p className="text-[11px] mt-1">Wie gut dein Design zum Journal passt. Multi-Study ist nie ein Nachteil (min. 50%).</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-indigo-600">25%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Methode</div>
              <p className="text-[11px] mt-1">Wie häufig deine Methode im Journal publiziert wird (hoch/mittel/niedrig).</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-indigo-600">20%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Datenart</div>
              <p className="text-[11px] mt-1">Wie typisch dein Datentyp für das Journal ist.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 pt-2 justify-center text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> ≥70% Hoch</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 40-69% Mittel</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt;40% Niedrig</span>
          </div>
          <p className="text-[11px] text-slate-400 text-center">Trait-Werte basieren auf Aims & Scope, Author Guidelines und Publikationsmustern 2023-2025. Stufen: 0.8 (hoch) / 0.5 (mittel) / 0.3 (niedrig).</p>
        </div>
      )}
    </div>
  );
}
