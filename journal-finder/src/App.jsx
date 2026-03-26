import React, { useState, useMemo } from 'react';
import {
  Search, BarChart3, BookOpen, Star, Filter, Info,
  ExternalLink, Database, Users, TrendingUp,
  CheckCircle2, AlertTriangle, Hash, Layers, Play, RefreshCw
} from 'lucide-react';

// Erweiterte Journal-Datenbank
const JOURNAL_DATABASE = [
  {
    id: 1,
    name: "Journal of Personality and Social Psychology (JPSP)",
    impactFactor: 7.6, vhb: "A+", category: "Personality",
    traits: { multiStudy: 1.0, crossSectional: 0.2, assessment: 0.6, wellBeing: 0.8, network: 0.7 },
    details: { n: "800+", method: "Experimental / Multi-Level / GGM", policy: "High barrier; theory contribution must be groundbreaking." },
    tags: ["personality", "social", "motivation", "well-being", "theory", "fwb", "financial", "self"]
  },
  {
    id: 2,
    name: "Psychological Assessment",
    impactFactor: 4.7, vhb: "A", category: "Assessment",
    traits: { multiStudy: 0.8, crossSectional: 1.0, assessment: 1.0, wellBeing: 0.7, network: 0.9 },
    details: { n: "300-600", method: "CFA, SEM, Network Analysis", policy: "Excellent for Nomological Networks & Validation." },
    tags: ["assessment", "validity", "scales", "network", "psychometrics", "nomological", "validation"]
  },
  {
    id: 3,
    name: "Journal of Business Research (JBR)",
    impactFactor: 11.3, vhb: "A", category: "Business",
    traits: { multiStudy: 0.9, crossSectional: 0.7, assessment: 0.5, wellBeing: 0.6, network: 0.4 },
    details: { n: "400+", method: "PLS-SEM / Experimental", policy: "High acceptance for FWB in consumer contexts." },
    tags: ["consumer", "marketing", "business", "well-being", "management", "financial"]
  },
  {
    id: 4,
    name: "Journal of Happiness Studies",
    impactFactor: 4.5, vhb: "B", category: "Well-being",
    traits: { multiStudy: 0.5, crossSectional: 1.0, assessment: 0.6, wellBeing: 1.0, network: 0.5 },
    details: { n: "200+", method: "Regression / Path Analysis", policy: "The standard for FWB and life satisfaction." },
    tags: ["happiness", "well-being", "positive-psychology", "quality-of-life", "subjective"]
  },
  {
    id: 5,
    name: "European Journal of Psychological Assessment (EJPA)",
    impactFactor: 3.2, vhb: "B", category: "Assessment",
    traits: { multiStudy: 0.7, crossSectional: 1.0, assessment: 1.0, wellBeing: 0.5, network: 0.8 },
    details: { n: "400+", method: "Network Modeling / Invariance", policy: "Looks for methodologically innovative validation studies." },
    tags: ["assessment", "measurement", "cross-cultural", "network", "psychometrics", "validation"]
  },
  {
    id: 6,
    name: "Personality and Individual Differences (PAID)",
    impactFactor: 3.9, vhb: "B", category: "Personality",
    traits: { multiStudy: 0.4, crossSectional: 0.9, assessment: 0.8, wellBeing: 0.7, network: 0.7 },
    details: { n: "250+", method: "Correlational / SEM", policy: "Publishes many network modeling papers; fast turnaround." },
    tags: ["personality", "traits", "iq", "individual-differences", "fwb", "network"]
  },
  {
    id: 7,
    name: "Assessment",
    impactFactor: 4.5, vhb: "A", category: "Assessment",
    traits: { multiStudy: 0.7, crossSectional: 1.0, assessment: 1.0, wellBeing: 0.4, network: 0.8 },
    details: { n: "400+", method: "CFA / Scale Development", policy: "Strong focus on clinical and personality assessment." },
    tags: ["assessment", "measurement", "clinical", "scales", "psychometrics"]
  }
];

export default function App() {
  const [topicInput, setTopicInput] = useState("Financial Well-being, Nomological Network, Assessment");
  const [design, setDesign] = useState("Multi-Study");
  const [method, setMethod] = useState("Network Modeling");
  const [dataType, setDataType] = useState("Cross-Sectional");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Applied criteria state
  const [appliedCriteria, setAppliedCriteria] = useState({
    topic: "Financial Well-being, Nomological Network, Assessment",
    design: "Multi-Study",
    method: "Network Modeling",
    dataType: "Cross-Sectional"
  });

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setAppliedCriteria({
        topic: topicInput,
        design: design,
        method: method,
        dataType: dataType
      });
      setIsSearching(false);
    }, 500);
  };

  const keywords = useMemo(() => {
    return appliedCriteria.topic.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== "");
  }, [appliedCriteria.topic]);

  const results = useMemo(() => {
    return JOURNAL_DATABASE.map(journal => {
      // 1. Topic Fit
      let keywordMatches = 0;
      keywords.forEach(kw => {
        const normKw = kw.replace(/-/g, ' ');
        const hasMatch = journal.tags.some(tag => {
          const normTag = tag.replace(/-/g, ' ');
          return normTag.includes(normKw) || normKw.includes(normTag);
        }) || journal.name.toLowerCase().includes(kw);
        if (hasMatch) keywordMatches++;
      });
      const topicScore = keywords.length > 0 ? (keywordMatches / keywords.length) * 100 : 50;

      // 2. Design Fit
      const designScore = (appliedCriteria.design === "Multi-Study" ? journal.traits.multiStudy : 0.6) * 100;

      // 3. Method Fit
      const methodScore = (appliedCriteria.method === "Network Modeling" ? journal.traits.network : 0.6) * 100;

      // 4. Data Fit
      const dataScore = (appliedCriteria.dataType === "Cross-Sectional" ? journal.traits.crossSectional : 0.6) * 100;

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
            Identifiziere den optimalen Fit für dein FWB Paper basierend auf Thema, Design und Methode.
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

          <div className="flex justify-center border-t border-slate-100 pt-8">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl"
            >
              {isSearching ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}
              {isSearching ? 'Wird berechnet...' : 'Jetzt vergleichen'}
            </button>
          </div>
        </div>

        <div className="grid gap-8">
          {results.filter(j => j.name.toLowerCase().includes(searchTerm.toLowerCase())).map(journal => (
            <div key={journal.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-all">
              <div className="lg:w-72 bg-slate-50 p-10 flex flex-col items-center justify-center border-r border-slate-100">
                <div className="text-6xl font-black text-slate-800 tracking-tighter">{journal.totalScore}%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Match Index</div>
                <div className="mt-8 pt-8 border-t border-slate-200 w-full flex justify-around text-center">
                  <div>
                    <div className="text-lg font-black">{journal.impactFactor}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">Impact</div>
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
                  <ExternalLink size={24} className="text-slate-300" />
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
          ))}
        </div>
      </main>
    </div>
  );
}

function FitStat({ label, score }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black">{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
