import { useState, useMemo } from 'react';
import {
  BarChart3, BookOpen, Info,
  ExternalLink, TrendingUp,
  Hash, Layers, Play
} from 'lucide-react';

// Journal-Datenbank (Impact Factors: JCR 2023; VHB: JOURQUAL 3, 2015)
// Trait-Werte: 0.8 = hoch (stark bevorzugt/haeufig), 0.5 = mittel (akzeptiert/gelegentlich), 0.3 = niedrig (selten/untypisch)
// Basierend auf Aims & Scope, Author Guidelines und Publikationsmustern 2023-2025
const JOURNAL_DATABASE = [
  {
    id: 1,
    name: "Journal of Personality and Social Psychology (JPSP)",
    url: "https://www.apa.org/pubs/journals/psp",
    impactFactor: 6.4, jcrYear: 2023, vhb: "A", category: "Personality",
    traits: { multiStudy: 0.8, singleStudy: 0.3, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.5, cfa: 0.3 },
    details: { n: "800+", method: "Experimental / Multi-Study / Multi-Level", policy: "Multi-study packages strongly preferred. Theory contribution must be groundbreaking. PPID section more open to correlational designs." },
    tags: ["personality", "social", "motivation", "well-being", "theory", "fwb", "financial", "self"]
  },
  {
    id: 2,
    name: "Psychological Assessment",
    url: "https://www.apa.org/pubs/journals/pas",
    impactFactor: 3.7, jcrYear: 2023, vhb: "B", category: "Assessment",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "300-600", method: "CFA / SEM / Network Analysis", policy: "CFA is the bread-and-butter method. Excellent for nomological networks & validation. Single-study with 1-2 samples is standard." },
    tags: ["assessment", "validity", "scales", "network", "psychometrics", "nomological", "validation"]
  },
  {
    id: 3,
    name: "Journal of Business Research (JBR)",
    url: "https://www.sciencedirect.com/journal/journal-of-business-research",
    impactFactor: 10.5, jcrYear: 2023, vhb: "B", category: "Business",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.3, sem: 0.8, cfa: 0.8 },
    details: { n: "400+", method: "PLS-SEM / CB-SEM / Experimental", policy: "PLS-SEM dominant method. Single-study with cross-sectional survey is standard. Dedicated PLS-SEM special issue (2024)." },
    tags: ["consumer", "marketing", "business", "well-being", "management", "financial"]
  },
  {
    id: 4,
    name: "Journal of Happiness Studies",
    url: "https://link.springer.com/journal/10902",
    impactFactor: 3.7, jcrYear: 2023, vhb: "C", category: "Well-being",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.5, network: 0.3, sem: 0.8, cfa: 0.5 },
    details: { n: "200+", method: "SEM / Regression / Path Analysis", policy: "The standard for FWB and life satisfaction. Single-study is the norm. SEM for mediation models very common." },
    tags: ["happiness", "well-being", "positive-psychology", "quality-of-life", "subjective", "financial"]
  },
  {
    id: 5,
    name: "European Journal of Psychological Assessment (EJPA)",
    url: "https://econtent.hogrefe.com/journal/ejpa",
    impactFactor: 2.8, jcrYear: 2023, vhb: "C", category: "Assessment",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "400+", method: "CFA / Measurement Invariance / Network", policy: "Multistudy Reports are an explicit article type. Prioritizes new measures or advancements of existing measures." },
    tags: ["assessment", "measurement", "cross-cultural", "network", "psychometrics", "validation"]
  },
  {
    id: 6,
    name: "Personality and Individual Differences (PAID)",
    url: "https://www.sciencedirect.com/journal/personality-and-individual-differences",
    impactFactor: 3.5, jcrYear: 2023, vhb: "C", category: "Personality",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "250+", method: "SEM / CFA / Network Analysis", policy: "Single-study with cross-sectional data is standard. Growing number of network papers. Fast turnaround." },
    tags: ["personality", "traits", "individual-differences", "fwb", "network", "well-being"]
  },
  {
    id: 7,
    name: "Assessment",
    url: "https://journals.sagepub.com/home/asm",
    impactFactor: 3.5, jcrYear: 2023, vhb: "B", category: "Assessment",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.5, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "400+", method: "CFA / Scale Development / Network", policy: "Development + validation sample (2-study) common. Longitudinal test-retest studies more common than in PAID. Network psychometrics welcome." },
    tags: ["assessment", "measurement", "clinical", "scales", "psychometrics"]
  },
  {
    id: 8,
    name: "Journal of Consumer Affairs",
    url: "https://onlinelibrary.wiley.com/journal/17456606",
    impactFactor: 3.0, jcrYear: 2023, vhb: "B", category: "Consumer",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.5, cfa: 0.3 },
    details: { n: "300+", method: "Regression / Econometric / SEM", policy: "Policy-oriented; panel data and longitudinal surveys valued. Econometric methods (OLS, IV, DiD) alongside SEM." },
    tags: ["consumer", "financial", "fwb", "well-being", "policy", "household", "debt"]
  },
  {
    id: 9,
    name: "Journal of Economic Psychology",
    url: "https://www.sciencedirect.com/journal/journal-of-economic-psychology",
    impactFactor: 2.8, jcrYear: 2023, vhb: "B", category: "Economics",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.5, cfa: 0.3 },
    details: { n: "300+", method: "Experimental / Regression / SEM", policy: "Methodologically flexible. Genuine mix of experiments, surveys, and panel data. Values causal identification." },
    tags: ["economic", "financial", "fwb", "decision-making", "behavior", "well-being", "saving"]
  },
  {
    id: 10,
    name: "Journal of Consumer Psychology",
    url: "https://myscp.onlinelibrary.wiley.com/journal/15327663",
    impactFactor: 4.0, jcrYear: 2023, vhb: "A", category: "Consumer",
    traits: { multiStudy: 0.8, singleStudy: 0.3, crossSectional: 0.8, longitudinal: 0.3, network: 0.3, sem: 0.3, cfa: 0.3 },
    details: { n: "500+ across studies", method: "Experimental / PROCESS Macro / ANOVA", policy: "3-5 converging experiments expected. Strong internal validity focus. Hayes PROCESS for mediation far more common than latent-variable SEM." },
    tags: ["consumer", "psychology", "financial", "decision-making", "motivation", "well-being"]
  },
  {
    id: 11,
    name: "Psychological Methods",
    url: "https://www.apa.org/pubs/journals/met",
    impactFactor: 7.1, jcrYear: 2023, vhb: "A", category: "Methods",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.8, sem: 0.8, cfa: 0.5 },
    details: { n: "Simulation + Empirical", method: "Network Modeling / SEM / Advanced Stats", policy: "Methodological innovation required. Data type is agnostic -- the contribution is the method, not the finding. Premier outlet for network psychometrics." },
    tags: ["methods", "statistics", "network", "sem", "psychometrics", "modeling", "simulation"]
  },
  {
    id: 12,
    name: "Multivariate Behavioral Research",
    url: "https://www.tandfonline.com/journals/hmbr20",
    impactFactor: 3.7, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.8, sem: 0.8, cfa: 0.8 },
    details: { n: "Simulation + Empirical", method: "Network Modeling / SEM / CFA / Longitudinal Methods", policy: "Flagship methods journal. Data type agnostic. Foundational network and SEM methodology papers. Strong CFA methods tradition." },
    tags: ["methods", "statistics", "network", "sem", "longitudinal", "modeling", "multivariate"]
  },
  {
    id: 13,
    name: "European Journal of Personality",
    url: "https://journals.sagepub.com/home/erp",
    impactFactor: 4.2, jcrYear: 2023, vhb: "B", category: "Personality",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "500+", method: "SEM / CFA / Network / Longitudinal", policy: "Values longitudinal and diary designs for personality processes. Multi-study for replicability. Network approaches increasingly published." },
    tags: ["personality", "traits", "network", "assessment", "individual-differences", "well-being"]
  },
  {
    id: 14,
    name: "Frontiers in Psychology",
    url: "https://www.frontiersin.org/journals/psychology",
    impactFactor: 2.6, jcrYear: 2023, vhb: "C", category: "General",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.5, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "200+", method: "Diverse (SEM, CFA, Network, Regression)", policy: "Open Access mega-journal. No design or method preference. High volume, broad scope. Quant. Psych. section welcomes psychometric methods." },
    tags: ["general", "well-being", "personality", "assessment", "financial", "fwb", "open-access"]
  },
  {
    id: 15,
    name: "International Journal of Consumer Studies",
    url: "https://onlinelibrary.wiley.com/journal/14706431",
    impactFactor: 8.6, jcrYear: 2023, vhb: "C", category: "Consumer",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.3, sem: 0.8, cfa: 0.8 },
    details: { n: "300+", method: "PLS-SEM / CB-SEM / Survey", policy: "Cross-sectional survey with SEM is standard. Two-step approach (CFA then SEM) dominates. International perspective valued." },
    tags: ["consumer", "financial", "fwb", "well-being", "international", "behavior", "household"]
  },
  {
    id: 16,
    name: "Social Indicators Research",
    url: "https://link.springer.com/journal/11205",
    impactFactor: 3.1, jcrYear: 2023, vhb: "B", category: "Well-being",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.5, network: 0.3, sem: 0.8, cfa: 0.5 },
    details: { n: "300+", method: "SEM / Regression / Multilevel", policy: "Broad well-being and quality-of-life scope. Cross-national comparative studies valued. SEM and regression dominant." },
    tags: ["well-being", "quality-of-life", "social", "indicators", "financial", "fwb", "cross-cultural"]
  },
  {
    id: 17,
    name: "Journal of Research in Personality",
    url: "https://www.sciencedirect.com/journal/journal-of-research-in-personality",
    impactFactor: 2.8, jcrYear: 2023, vhb: "B", category: "Personality",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.8, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "400+", method: "SEM / CFA / Longitudinal / Network", policy: "Strong tradition of longitudinal personality research. Values personality dynamics and processes. Open to network approaches." },
    tags: ["personality", "traits", "individual-differences", "well-being", "longitudinal", "assessment"]
  },
  {
    id: 18,
    name: "Journal of Behavioral and Experimental Finance",
    url: "https://www.sciencedirect.com/journal/journal-of-behavioral-and-experimental-finance",
    impactFactor: 4.3, jcrYear: 2023, vhb: "C", category: "Finance",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.5, network: 0.3, sem: 0.5, cfa: 0.3 },
    details: { n: "300+", method: "Experimental / Regression / SEM", policy: "Behavioral finance meets psychology. Financial decision-making and financial literacy focus. Experiments and surveys both accepted." },
    tags: ["financial", "fwb", "behavioral", "finance", "decision-making", "literacy", "experimental"]
  },
  {
    id: 19,
    name: "Journal of Family and Economic Issues",
    url: "https://link.springer.com/journal/10834",
    impactFactor: 2.4, jcrYear: 2023, vhb: "C", category: "Economics",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.8, cfa: 0.3 },
    details: { n: "300+", method: "SEM / Regression / Panel Data", policy: "Family financial well-being focus. Publishes FWB, financial stress, and economic hardship research. Panel surveys valued." },
    tags: ["family", "financial", "fwb", "well-being", "economic", "stress", "household"]
  },
  {
    id: 20,
    name: "Behavior Research Methods",
    url: "https://link.springer.com/journal/13428",
    impactFactor: 4.6, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.8, sem: 0.8, cfa: 0.5 },
    details: { n: "Simulation + Empirical", method: "Network / SEM / Software Tutorials", policy: "Methods and tools for behavioral research. Software tutorials (R packages) highly valued. Network and SEM tool papers common." },
    tags: ["methods", "statistics", "network", "software", "modeling", "psychometrics", "tools"]
  },
  {
    id: 21,
    name: "Structural Equation Modeling",
    url: "https://www.tandfonline.com/journals/hsem20",
    impactFactor: 2.4, jcrYear: 2023, vhb: "B", category: "Methods",
    traits: { multiStudy: 0.5, singleStudy: 0.5, crossSectional: 0.5, longitudinal: 0.5, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "Simulation + Empirical", method: "SEM / CFA / Measurement Invariance", policy: "The dedicated SEM journal. Methodological SEM advances and substantive applications. CFA methodology central." },
    tags: ["sem", "methods", "statistics", "cfa", "measurement", "invariance", "modeling"]
  },
  {
    id: 22,
    name: "Current Psychology",
    url: "https://link.springer.com/journal/12144",
    impactFactor: 2.5, jcrYear: 2023, vhb: "C", category: "General",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.3, network: 0.5, sem: 0.8, cfa: 0.8 },
    details: { n: "200+", method: "SEM / CFA / Network / Regression", policy: "Broad psychology scope. High volume, relatively fast review. Accepts network, SEM, and CFA papers across topics." },
    tags: ["general", "well-being", "personality", "fwb", "financial", "network", "assessment"]
  },
  {
    id: 23,
    name: "Applied Psychology: An International Review",
    url: "https://iaap-journals.onlinelibrary.wiley.com/journal/14640597",
    impactFactor: 4.9, jcrYear: 2023, vhb: "B", category: "Applied",
    traits: { multiStudy: 0.5, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.8, cfa: 0.5 },
    details: { n: "400+", method: "SEM / Regression / Multilevel", policy: "Applied psychology across work, health, and consumer domains. International samples valued. SEM dominant method." },
    tags: ["applied", "well-being", "work", "health", "financial", "cross-cultural", "consumer"]
  },
  {
    id: 24,
    name: "Journal of Financial Counseling and Planning",
    url: "https://connect.springerpub.com/content/sgrjfcp",
    impactFactor: 1.8, jcrYear: 2023, vhb: "C", category: "Finance",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.5, longitudinal: 0.5, network: 0.3, sem: 0.5, cfa: 0.3 },
    details: { n: "200+", method: "Regression / SEM / Survey", policy: "Core FWB journal. Financial counseling, planning, and well-being. Practitioner-relevant research valued." },
    tags: ["financial", "fwb", "well-being", "counseling", "planning", "literacy", "household"]
  },
  {
    id: 25,
    name: "International Journal of Wellbeing",
    url: "https://www.internationaljournalofwellbeing.org",
    impactFactor: 2.0, jcrYear: 2023, vhb: "C", category: "Well-being",
    traits: { multiStudy: 0.3, singleStudy: 0.8, crossSectional: 0.8, longitudinal: 0.5, network: 0.3, sem: 0.8, cfa: 0.5 },
    details: { n: "200+", method: "SEM / Regression / Mixed Methods", policy: "Open access. Dedicated to well-being research across domains including financial well-being. Interdisciplinary welcome." },
    tags: ["well-being", "happiness", "fwb", "financial", "positive-psychology", "quality-of-life", "open-access"]
  }
];

const TRAIT_MAP = {
  design: { "Multi-Study": "multiStudy", "Single-Study": "singleStudy" },
  method: { "Network Modeling": "network", "SEM": "sem", "CFA": "cfa" },
  dataType: { "Cross-Sectional": "crossSectional", "Longitudinal": "longitudinal" }
};

function getFitColor(score) {
  if (score >= 70) return { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 40) return { bar: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50" };
  return { bar: "bg-red-400", text: "text-red-500", bg: "bg-red-50" };
}

export default function App() {
  const [topicInput, setTopicInput] = useState("Financial Well-being, Nomological Network, Assessment");
  const [design, setDesign] = useState("Multi-Study");
  const [method, setMethod] = useState("Network Modeling");
  const [dataType, setDataType] = useState("Cross-Sectional");

  const [appliedCriteria, setAppliedCriteria] = useState({
    topic: "Financial Well-being, Nomological Network, Assessment",
    design: "Multi-Study",
    method: "Network Modeling",
    dataType: "Cross-Sectional"
  });

  const handleSearch = () => {
    setAppliedCriteria({
      topic: topicInput,
      design,
      method,
      dataType
    });
  };

  const keywords = useMemo(() => {
    return appliedCriteria.topic.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== "");
  }, [appliedCriteria.topic]);

  const results = useMemo(() => {
    const methodTrait = TRAIT_MAP.method[appliedCriteria.method];
    const dataTrait = TRAIT_MAP.dataType[appliedCriteria.dataType];

    return JOURNAL_DATABASE.map(journal => {
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

      // Design Fit: asymmetrisch -- Multi-Study ist nie ein Nachteil
      // Multi-Study gewaehlt: Journals die es bevorzugen (0.8) → 80%, Rest → 50% (neutral, nie rot)
      // Single-Study gewaehlt: Journals die es akzeptieren (0.8) → 80%,
      //   Journals die Multi-Study verlangen (0.8 multiStudy) → 30% (Risiko)
      let designScore;
      if (appliedCriteria.design === "Multi-Study") {
        // Multi-Study schadet nie: minimum 50%, Bonus wenn bevorzugt
        designScore = Math.max(journal.traits.multiStudy, 0.5) * 100;
      } else {
        // Single-Study: riskant bei Journals die Multi-Study verlangen
        designScore = journal.traits.singleStudy * 100;
      }

      const methodScore = (journal.traits[methodTrait] ?? 0.5) * 100;
      const dataScore = (journal.traits[dataTrait] ?? 0.5) * 100;
      const totalScore = Math.round((topicScore * 0.35) + (designScore * 0.20) + (methodScore * 0.25) + (dataScore * 0.20));

      return { ...journal, scores: { topic: topicScore, design: designScore, method: methodScore, data: dataScore }, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [keywords, appliedCriteria]);

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
          <h1 className="text-6xl font-black tracking-tighter mb-6">Journal Strategy Dashboard</h1>
          <p className="text-xl text-indigo-200/80 max-w-3xl leading-relaxed">
            Identifiziere den optimalen Fit fuer dein FWB Paper basierend auf Thema, Design und Methode.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 p-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} className="text-indigo-500" /> Keywords (Forschungsthema)
              </label>
              <textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-sm h-24"
                placeholder="Themen durch Komma trennen..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} className="text-indigo-500" /> Forschungs-Design
              </label>
              <select value={design} onChange={(e) => setDesign(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none outline-none">
                <option value="Multi-Study">Multi-Study Design</option>
                <option value="Single-Study">Single-Study</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-500" /> Analyse-Methode
              </label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none outline-none">
                <option value="Network Modeling">Network Modeling</option>
                <option value="SEM">SEM / Path Analysis</option>
                <option value="CFA">CFA / Assessment</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-500" /> Datenart
              </label>
              <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold appearance-none outline-none">
                <option value="Cross-Sectional">Cross-Sectional</option>
                <option value="Longitudinal">Longitudinal</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 border-t border-slate-100 pt-8">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl"
            >
              <Play fill="currentColor" />
              Jetzt vergleichen
            </button>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Hoch</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Mittel</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Niedrig</span>
            </div>
          </div>
        </div>

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
                  <FitStat label="Datenart" score={journal.scores.data} />
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                  <Info className="text-indigo-400 shrink-0" size={20} />
                  <p className="text-sm text-slate-600 italic">"{journal.details.policy} Recommended method: {journal.details.method}."</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
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
