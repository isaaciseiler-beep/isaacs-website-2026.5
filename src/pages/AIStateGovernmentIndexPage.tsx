import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Database,
  Filter,
  Landmark,
  LineChart,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  aiIndexCriteria,
  aiIndexSources,
  aiIndexStates,
  type AiIndexCriterionKey,
  type AiIndexParty,
  type AiIndexRegion,
  type AiIndexState,
} from "@/lib/aiStateGovIndex";

const EASE_TEXT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const partyLabels: Record<AiIndexParty, string> = {
  D: "Democratic executive",
  R: "Republican executive",
};

const regionOrder: AiIndexRegion[] = ["East", "South", "Midwest", "West"];
const partyOrder: AiIndexParty[] = ["D", "R"];

const criterionCategoryColor: Record<string, string> = {
  "GenAI Adoption": "#1c7c74",
  "Government Infrastructure": "#b75d2a",
  "Employee Policy": "#5856a6",
};

const scoreBands = [
  { label: "Excellent", min: 80, max: 100, color: "#0f766e" },
  { label: "Above average", min: 60, max: 79.999, color: "#3b82a0" },
  { label: "Average", min: 40, max: 59.999, color: "#b9831f" },
  { label: "Below average", min: 20, max: 39.999, color: "#c75a2b" },
  { label: "Poor", min: 0, max: 19.999, color: "#8f2d56" },
];

const stateAbbreviations: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  "American Samoa": "AS",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Guam: "GU",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Marina Islands": "MP",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  "Virgin Islands": "VI",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

type RankedState = AiIndexState & { rank: number };

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const percent = (count: number, total: number) => Math.round((count / total) * 100);
const round = (value: number, digits = 0) => Number(value.toFixed(digits));
const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatMoney = (value: number) => `$${round(value, 1)}B`;

const getBand = (score: number) => scoreBands.find((band) => score >= band.min && score <= band.max) ?? scoreBands[4];

const getScoreColor = (score: number) => getBand(score).color;

const categoryScore = (state: AiIndexState, category: string) => {
  const criteria = aiIndexCriteria.filter((criterion) => criterion.category === category);
  const earned = criteria.reduce((sum, criterion) => sum + state.criteria[criterion.key], 0);
  const possible = criteria.reduce((sum, criterion) => sum + criterion.max, 0);
  return (earned / possible) * 100;
};

const StatPanel = ({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Database;
}) => (
  <div className="site-corner border border-foreground/10 bg-background/85 p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">{label}</span>
      <Icon className="h-4 w-4 text-foreground/45" strokeWidth={1.5} />
    </div>
    <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
    <p className="mt-2 text-xs leading-relaxed text-foreground/55">{detail}</p>
  </div>
);

const FilterButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`site-corner inline-flex h-9 items-center justify-center border px-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-foreground/12 bg-background/70 text-foreground/62 hover:border-foreground/35 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const DashboardTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="site-corner border border-foreground/10 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="font-mono uppercase tracking-[0.18em] text-foreground/50">{label ?? payload[0]?.payload?.state}</div>
      {payload.map((item: any) => (
        <div key={item.name ?? item.dataKey} className="mt-1 flex items-center gap-2 text-foreground/70">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>
            {item.name ?? item.dataKey}: {typeof item.value === "number" ? round(item.value, 1) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const AIStateGovernmentIndexPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<AiIndexRegion | "All">("All");
  const [selectedParty, setSelectedParty] = useState<AiIndexParty | "All">("All");
  const [selectedCriterion, setSelectedCriterion] = useState<AiIndexCriterionKey | "All">("All");
  const [query, setQuery] = useState("");
  const rankedStates = useMemo<RankedState[]>(
    () =>
      [...aiIndexStates]
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .map((state, index) => ({ ...state, rank: index + 1 })),
    [],
  );
  const [selectedStateName, setSelectedStateName] = useState(rankedStates[0].state);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const selectedState = rankedStates.find((state) => state.state === selectedStateName) ?? rankedStates[0];

  const filteredStates = useMemo(
    () =>
      rankedStates.filter((state) => {
        const matchesRegion = selectedRegion === "All" || state.region === selectedRegion;
        const matchesParty = selectedParty === "All" || state.party === selectedParty;
        const matchesCriterion = selectedCriterion === "All" || state.criteria[selectedCriterion] > 0;
        const matchesQuery = state.state.toLowerCase().includes(query.trim().toLowerCase());
        return matchesRegion && matchesParty && matchesCriterion && matchesQuery;
      }),
    [query, rankedStates, selectedCriterion, selectedParty, selectedRegion],
  );

  const meanComposite = average(aiIndexStates.map((state) => state.compositeScore));
  const medianComposite = [...aiIndexStates].sort((a, b) => a.compositeScore - b.compositeScore)[Math.floor(aiIndexStates.length / 2)]
    .compositeScore;
  const statesAbove80 = aiIndexStates.filter((state) => state.compositeScore >= 80).length;
  const statesBelow50 = aiIndexStates.filter((state) => state.compositeScore < 50).length;
  const guidancePercent = percent(aiIndexStates.filter((state) => state.criteria.guidance > 0).length, aiIndexStates.length);
  const trainingPercent = percent(aiIndexStates.filter((state) => state.criteria.training > 0).length, aiIndexStates.length);
  const enterprisePercent = percent(aiIndexStates.filter((state) => state.criteria.enterprisePilot > 0).length, aiIndexStates.length);
  const roadmapPercent = percent(aiIndexStates.filter((state) => state.criteria.aiPlan > 0).length, aiIndexStates.length);

  const categoryData = ["GenAI Adoption", "Government Infrastructure", "Employee Policy"].map((category) => ({
    category,
    average: round(average(aiIndexStates.map((state) => categoryScore(state, category))), 1),
    fill: criterionCategoryColor[category],
  }));

  const regionData = regionOrder.map((region) => {
    const states = aiIndexStates.filter((state) => state.region === region);
    return {
      region,
      average: round(average(states.map((state) => state.compositeScore)), 1),
      preparedness: round(average(states.map((state) => state.preparednessScore)), 1),
      count: states.length,
    };
  });

  const partyData = partyOrder.map((party) => {
    const states = aiIndexStates.filter((state) => state.party === party);
    return {
      party,
      label: party,
      average: round(average(states.map((state) => state.compositeScore)), 1),
      count: states.length,
    };
  });

  const criterionData = aiIndexCriteria.map((criterion) => {
    const count = aiIndexStates.filter((state) => state.criteria[criterion.key] > 0).length;
    return {
      ...criterion,
      count,
      percent: percent(count, aiIndexStates.length),
      fill: criterionCategoryColor[criterion.category],
    };
  });

  const bandData = scoreBands.map((band) => ({
    ...band,
    count: aiIndexStates.filter((state) => state.compositeScore >= band.min && state.compositeScore <= band.max).length,
  }));

  const scatterData = aiIndexStates.map((state) => ({
    state: state.state,
    budget: state.budgetBillions,
    composite: round(state.compositeScore, 1),
    party: state.party,
    region: state.region,
    workforce: state.workforce,
  }));

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f4ec] text-[#11140f] dark:bg-background dark:text-foreground">
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={handleSearchOpen}
        showToggle={false}
      />

      <motion.div
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          marginRight: searchOpen && !isMobile ? 240 : 0,
          width:
            sidebarOpen && !isMobile
              ? "calc(100% - 240px)"
              : searchOpen && !isMobile
                ? "calc(100% - 240px)"
                : "100%",
        }}
        transition={{ duration: 0.56, ease: EASE_TEXT }}
      >
        <motion.main
          className="pb-24"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.62, ease: EASE_TEXT, delay: 0.08 }}
        >
          <section className="relative min-h-[92svh] overflow-hidden border-b border-foreground/10 px-5 pt-28 sm:px-8">
            <div className="absolute inset-x-0 top-0 h-32 bg-[#1c7c74]" />
            <div className="absolute bottom-0 left-0 h-1/3 w-full bg-[#d8e9df]" />
            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-end">
              <div className="pb-10 lg:pb-20">
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="group mb-10 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#1c7c74]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                  All projects
                </button>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="site-corner bg-[#f7c948] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#17140b]">
                    Council of State Governments
                  </span>
                  <span className="site-corner border border-foreground/15 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                    2025 public evidence benchmark
                  </span>
                </div>

                <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                  The state GenAI gap is now measurable.
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-relaxed text-foreground/68 sm:text-xl">
                  I rebuilt the AI in State Government Index as a data-first interactive article: 56 governments,
                  15 public-evidence criteria, and a live view of which states are building real capacity versus
                  only talking about it.
                </p>
              </div>

              <div className="site-corner mb-8 border border-foreground/10 bg-background/85 p-5 shadow-2xl lg:mb-20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Top state</p>
                    <h2 className="mt-1 text-3xl font-semibold tracking-tight">Maryland</h2>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1c7c74] text-xl font-semibold text-white">
                    100
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={rankedStates.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 22, top: 4, bottom: 4 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="state" type="category" width={108} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                    <Tooltip content={<DashboardTooltip />} cursor={{ fill: "rgba(17,20,15,0.06)" }} />
                    <Bar dataKey="compositeScore" name="Composite score" radius={[0, 6, 6, 0]}>
                      {rankedStates.slice(0, 8).map((state) => (
                        <Cell key={state.state} fill={getScoreColor(state.compositeScore)} />
                      ))}
                      <LabelList dataKey="compositeScore" position="right" formatter={(value: number) => round(value)} className="fill-foreground text-[10px]" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="border-b border-foreground/10 bg-background px-5 py-8 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatPanel label="Governments scored" value="56" detail="50 states, five territories, and DC." icon={Database} />
              <StatPanel label="Median score" value={`${round(medianComposite)}/100`} detail={`Mean composite score: ${round(meanComposite, 1)}.`} icon={BarChart3} />
              <StatPanel label="Above 80" value={`${statesAbove80}`} detail="Only a small top tier clears the excellent band." icon={Sparkles} />
              <StatPanel label="Below 50" value={`${statesBelow50}`} detail="More than half sit below the midpoint." icon={LineChart} />
            </div>
          </section>

          <section className="bg-[#11140f] px-5 py-16 text-white sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">Live explorer</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find the signal in the rankings.</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/62">
                  Filter by region, executive party control, or a specific public-evidence criterion. Click any state to
                  inspect how its composite score breaks into adoption, infrastructure, and employee policy.
                </p>
              </div>

              <div className="space-y-4">
                <div className="site-corner border border-white/12 bg-white/[0.04] p-4">
                  <div className="mb-4 flex items-center gap-2 text-white/70">
                    <Filter className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em]">Filters</span>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Region</span>
                      <div className="flex flex-wrap gap-2">
                        <FilterButton active={selectedRegion === "All"} onClick={() => setSelectedRegion("All")}>All</FilterButton>
                        {regionOrder.map((region) => (
                          <FilterButton key={region} active={selectedRegion === region} onClick={() => setSelectedRegion(region)}>
                            {region}
                          </FilterButton>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Executive control</span>
                      <div className="flex flex-wrap gap-2">
                        <FilterButton active={selectedParty === "All"} onClick={() => setSelectedParty("All")}>All</FilterButton>
                        {partyOrder.map((party) => (
                          <FilterButton key={party} active={selectedParty === party} onClick={() => setSelectedParty(party)}>
                            {party}
                          </FilterButton>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
                    <label className="site-corner flex h-11 items-center gap-3 border border-white/12 bg-black/20 px-3 text-white/70">
                      <Search className="h-4 w-4" strokeWidth={1.5} />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search state or territory"
                        className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      />
                    </label>
                    <select
                      value={selectedCriterion}
                      onChange={(event) => setSelectedCriterion(event.target.value as AiIndexCriterionKey | "All")}
                      className="site-corner h-11 border border-white/12 bg-black/20 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white outline-none"
                    >
                      <option value="All">Any criterion</option>
                      {aiIndexCriteria.map((criterion) => (
                        <option key={criterion.key} value={criterion.key}>
                          Has {criterion.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
                  <div className="site-corner max-h-[560px] overflow-auto border border-white/12 bg-white/[0.04]">
                    <table className="w-full min-w-[680px] text-left">
                      <thead className="sticky top-0 bg-[#11140f] text-white/45">
                        <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.18em]">
                          <th className="px-4 py-3">Rank</th>
                          <th className="px-4 py-3">Government</th>
                          <th className="px-4 py-3">Region</th>
                          <th className="px-4 py-3">Party</th>
                          <th className="px-4 py-3 text-right">Composite</th>
                          <th className="px-4 py-3 text-right">Preparedness</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStates.map((state) => (
                          <tr
                            key={state.state}
                            onClick={() => setSelectedStateName(state.state)}
                            className={`cursor-pointer border-b border-white/8 text-sm transition-colors hover:bg-white/[0.07] ${
                              selectedState.state === state.state ? "bg-white/[0.1]" : ""
                            }`}
                          >
                            <td className="px-4 py-3 font-mono text-white/45">#{state.rank}</td>
                            <td className="px-4 py-3 font-medium text-white">{state.state}</td>
                            <td className="px-4 py-3 text-white/58">{state.region}</td>
                            <td className="px-4 py-3 text-white/58">{state.party}</td>
                            <td className="px-4 py-3 text-right font-mono text-white">{round(state.compositeScore, 1)}</td>
                            <td className="px-4 py-3 text-right font-mono text-white/62">{state.preparednessScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="site-corner border border-white/12 bg-white/[0.05] p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Selected</p>
                        <h3 className="mt-1 text-3xl font-semibold tracking-tight">{selectedState.state}</h3>
                      </div>
                      <span className="site-corner bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#11140f]">
                        #{selectedState.rank}
                      </span>
                    </div>
                    <div className="mb-5 grid grid-cols-2 gap-2">
                      <div className="site-corner bg-black/20 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">Composite</p>
                        <p className="mt-1 text-2xl font-semibold">{round(selectedState.compositeScore, 1)}</p>
                      </div>
                      <div className="site-corner bg-black/20 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">Raw score</p>
                        <p className="mt-1 text-2xl font-semibold">{selectedState.preparednessScore}</p>
                      </div>
                      <div className="site-corner bg-black/20 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">Budget</p>
                        <p className="mt-1 text-2xl font-semibold">{formatMoney(selectedState.budgetBillions)}</p>
                      </div>
                      <div className="site-corner bg-black/20 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">Workforce</p>
                        <p className="mt-1 text-2xl font-semibold">{formatNumber(selectedState.workforce)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {categoryData.map((category) => {
                        const value = round(categoryScore(selectedState, category.category));
                        return (
                          <div key={category.category}>
                            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                              <span>{category.category}</span>
                              <span>{value}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: category.fill }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-background px-5 py-16 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Score distribution</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">The index is top-heavy, then drops fast.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/62">
                  Composite scoring keeps the preparedness score as the main signal, then adjusts for government
                  resources. The result still rewards states with visible implementation, not just size.
                </p>
                <div className="mt-8 h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankedStates} margin={{ top: 20, right: 8, left: -28, bottom: 4 }}>
                      <CartesianGrid stroke="rgba(17,20,15,0.1)" vertical={false} />
                      <XAxis dataKey="state" hide />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                      <Tooltip content={<DashboardTooltip />} cursor={{ fill: "rgba(17,20,15,0.06)" }} />
                      <Bar dataKey="compositeScore" name="Composite score" radius={[5, 5, 0, 0]}>
                        {rankedStates.map((state) => (
                          <Cell key={state.state} fill={getScoreColor(state.compositeScore)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid content-start gap-3">
                {bandData.map((band) => (
                  <div key={band.label} className="site-corner border border-foreground/10 bg-[#f6f4ec] p-4 dark:bg-card">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">{band.label}</span>
                      <span className="font-mono text-xs text-foreground/55">{band.min}-{Math.floor(band.max)}</span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="text-4xl font-semibold" style={{ color: band.color }}>
                        {band.count}
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                        <div className="h-full rounded-full" style={{ width: `${percent(band.count, aiIndexStates.length)}%`, backgroundColor: band.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-foreground/10 bg-[#e7efe9] px-5 py-16 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Criteria adoption</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">The missing pieces are practical, not abstract.</h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                    Public guidance is relatively common. Training, action plans, permanent AI offices, and enterprise
                    pilots are much rarer. That is the core gap: governments are writing rules faster than they are
                    building repeatable capacity.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <StatPanel label="Guidance" value={`${guidancePercent}%`} detail="Have public employee guidance." icon={ShieldCheck} />
                    <StatPanel label="Training" value={`${trainingPercent}%`} detail="Show public employee training." icon={Users} />
                    <StatPanel label="Roadmaps" value={`${roadmapPercent}%`} detail="Have a GenAI action plan." icon={SlidersHorizontal} />
                    <StatPanel label="Pilots" value={`${enterprisePercent}%`} detail="Have public enterprise trials." icon={Bot} />
                  </div>
                </div>
                <div className="site-corner border border-foreground/10 bg-background p-4">
                  <ResponsiveContainer width="100%" height={520}>
                    <BarChart data={criterionData} layout="vertical" margin={{ top: 8, right: 34, bottom: 8, left: 106 }}>
                      <CartesianGrid stroke="rgba(17,20,15,0.1)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                      <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} width={112} />
                      <Tooltip content={<DashboardTooltip />} cursor={{ fill: "rgba(17,20,15,0.05)" }} />
                      <Bar dataKey="percent" name="Governments with evidence" radius={[0, 5, 5, 0]}>
                        {criterionData.map((criterion) => (
                          <Cell key={criterion.key} fill={criterion.fill} />
                        ))}
                        <LabelList dataKey="percent" position="right" formatter={(value: number) => `${value}%`} className="fill-foreground text-[10px]" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-background px-5 py-16 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
              <div className="site-corner border border-foreground/10 bg-[#f6f4ec] p-5 dark:bg-card">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Regional pattern</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">East leads the average.</h2>
                  </div>
                  <Landmark className="h-5 w-5 text-foreground/45" strokeWidth={1.5} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData} margin={{ top: 18, right: 6, left: -26, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(17,20,15,0.1)" vertical={false} />
                    <XAxis dataKey="region" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                    <YAxis domain={[0, 70]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                    <Tooltip content={<DashboardTooltip />} />
                    <Bar dataKey="average" name="Average composite" radius={[5, 5, 0, 0]} fill="#1c7c74">
                      <LabelList dataKey="average" position="top" formatter={(value: number) => round(value, 1)} className="fill-foreground text-[10px]" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="site-corner border border-foreground/10 bg-[#f6f4ec] p-5 dark:bg-card">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Party control</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Executive control tracks with score, but does not explain all of it.</h2>
                  </div>
                  <Users className="h-5 w-5 text-foreground/45" strokeWidth={1.5} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={partyData} margin={{ top: 18, right: 12, left: -26, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(17,20,15,0.1)" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                    <YAxis domain={[0, 70]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
                    <Tooltip content={<DashboardTooltip />} />
                    <Bar dataKey="average" name="Average composite" radius={[5, 5, 0, 0]}>
                      {partyData.map((party) => (
                        <Cell key={party.party} fill={party.party === "D" ? "#3b82a0" : "#b75d2a"} />
                      ))}
                      <LabelList dataKey="average" position="top" formatter={(value: number) => round(value, 1)} className="fill-foreground text-[10px]" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 grid gap-2 text-xs text-foreground/58 sm:grid-cols-2">
                  {partyData.map((party) => (
                    <p key={party.party}>
                      <span className="font-mono text-foreground/80">{party.party}</span> covers {party.count} governments in
                      the dataset: {partyLabels[party.party]}.
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#11140f] px-5 py-16 text-white sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[390px_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">Resources</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Budget helps, but it is not destiny.</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/62">
                  The composite model intentionally keeps preparedness as the majority signal while correcting for
                  government resources. Smaller governments can still rank well when their public evidence is concrete.
                </p>
              </div>
              <div className="site-corner border border-white/12 bg-white/[0.04] p-4">
                <ResponsiveContainer width="100%" height={420}>
                  <ScatterChart margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="budget"
                      name="Budget"
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)" }}
                      label={{ value: "Budget, billions", position: "insideBottom", fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="composite"
                      name="Composite score"
                      type="number"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)" }}
                    />
                    <Tooltip content={<DashboardTooltip />} cursor={{ stroke: "rgba(255,255,255,0.25)" }} />
                    <Scatter data={scatterData} name="Governments">
                      {scatterData.map((state) => (
                        <Cell key={state.state} fill={state.party === "D" ? "#7dd3fc" : "#f59e0b"} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="bg-background px-5 py-16 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[430px_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">State tile view</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Every tile is a public evidence record.</h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                    The dashboard below is deliberately not a winner-take-all leaderboard. It makes the whole landscape
                    scannable, including territories and states where public evidence is sparse.
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-8">
                  {rankedStates.map((state) => (
                    <button
                      key={state.state}
                      type="button"
                      title={`${state.state}: ${round(state.compositeScore, 1)}`}
                      onClick={() => setSelectedStateName(state.state)}
                      className={`site-corner aspect-square border p-2 text-left transition-transform hover:-translate-y-0.5 ${
                        selectedState.state === state.state ? "border-foreground shadow-lg" : "border-foreground/10"
                      }`}
                      style={{ backgroundColor: getScoreColor(state.compositeScore), color: "#fff" }}
                    >
                      <span className="block font-mono text-[10px] text-white/70">#{state.rank}</span>
                      <span className="block text-lg font-semibold leading-none">{stateAbbreviations[state.state] ?? state.state.slice(0, 2)}</span>
                      <span className="mt-1 block font-mono text-[10px] text-white/80">{round(state.compositeScore)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-foreground/10 bg-[#f6f4ec] px-5 py-16 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Roadmap</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">What the index says leaders should do next.</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Publish clear guidance",
                    text: "Universal executive-branch guidance is the minimum floor for safe experimentation.",
                  },
                  {
                    icon: Users,
                    title: "Train the workforce",
                    text: "Employees need practical GenAI literacy, not just warnings about what not to do.",
                  },
                  {
                    icon: Bot,
                    title: "Run public pilots",
                    text: "Enterprise trials and sandboxes create measurable evidence before full deployment.",
                  },
                  {
                    icon: SlidersHorizontal,
                    title: "Write a roadmap",
                    text: "A public action plan turns isolated experiments into a visible government strategy.",
                  },
                  {
                    icon: Landmark,
                    title: "Make ownership permanent",
                    text: "Dedicated staff and offices help governments learn instead of rediscovering the same problems.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Lead transparently",
                    text: "Public evidence is part of responsible deployment, not a communications afterthought.",
                  },
                ].map((item) => (
                  <div key={item.title} className="site-corner border border-foreground/10 bg-background p-5">
                    <item.icon className="h-5 w-5 text-[#1c7c74]" strokeWidth={1.6} />
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/62">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-background px-5 py-16 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Methodology</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Public evidence only.</h2>
                <div className="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/66">
                  <p>
                    The benchmark scores publicly accessible evidence of generative AI activity inside executive-branch
                    state and territory government. Internal tools, private memos, or undocumented deployments do not
                    count, because transparency is part of the readiness test.
                  </p>
                  <p>
                    The raw preparedness score spans 15 criteria and 20 possible points across GenAI adoption,
                    government infrastructure, and employee policy. The composite score keeps preparedness as the
                    central signal while applying a resource-efficiency adjustment.
                  </p>
                </div>
              </div>
              <div className="site-corner border border-foreground/10 bg-[#f6f4ec] p-5 dark:bg-card">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">Source files</p>
                <div className="mt-4 space-y-2">
                  {aiIndexSources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 border-b border-foreground/10 py-3 text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      <span>{source.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </motion.main>

        <Footer />
      </motion.div>

      <SiteHeader
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        searchOpen={searchOpen}
        onSearchOpen={handleSearchOpen}
        onSearchClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default AIStateGovernmentIndexPage;
