export type AiIndexParty = "D" | "R";
export type AiIndexRegion = "East" | "Midwest" | "South" | "West";

export type AiIndexCriterionKey =
  | "sandbox"
  | "deployment"
  | "futureIntentions"
  | "aiPlan"
  | "enterprisePilot"
  | "website"
  | "eoLeg"
  | "taskForce"
  | "aiFte"
  | "office"
  | "guidance"
  | "allowedUse"
  | "training"
  | "inventory"
  | "approval";

export type AiIndexState = {
  state: string;
  party: AiIndexParty;
  region: AiIndexRegion;
  population: number;
  budgetBillions: number;
  workforce: number;
  compositeScore: number;
  preparednessScore: number;
  criteria: Record<AiIndexCriterionKey, number>;
};

type Row = [
  string,
  AiIndexParty,
  AiIndexRegion,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const rows: Row[] = [
  ["Maryland", "D", "East", 6263220, 38.59, 104677, 100, 2, 1, 1, 2, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 85],
  ["California", "D", "West", 39431263, 297.86, 495191, 87.05565526111599, 2, 1, 1, 0, 3, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 75],
  ["Arizona", "D", "West", 7582384, 21.69, 82388, 85.30630916741791, 2, 1, 1, 0, 3, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 70],
  ["Georgia", "R", "South", 11180878, 36.1, 127506, 84.8334686735286, 2, 0, 1, 2, 0, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 70],
  ["Pennsylvania", "D", "East", 13078751, 53.72, 150599, 83.5402793024541, 2, 0, 1, 0, 3, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 70],
  ["Alabama", "R", "South", 5157699, 12.69, 97676, 75.60487111010062, 2, 0, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 55],
  ["Utah", "R", "West", 3503613, 29.36, 70656, 71.75523512046917, 2, 1, 1, 0, 3, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 60],
  ["New Jersey", "D", "East", 9500851, 55.9, 131829, 71.66961778496339, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 60],
  ["Massachusetts", "D", "East", 7136171, 48.79, 109413, 71.46414009332248, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 60],
  ["District of Columbia", "D", "East", 702250, 21, 39872, 70.85383285171154, 2, 1, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 60],
  ["North Carolina", "D", "South", 11046024, 30.25, 141736, 70.25971405032854, 0, 1, 1, 0, 3, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 55],
  ["Colorado", "D", "West", 5957493, 27.52, 102570, 68.55872538914545, 0, 0, 1, 0, 3, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 55],
  ["Oregon", "D", "West", 4272371, 39.58, 85200, 65.76420189811309, 0, 0, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 55],
  ["Wisconsin", "D", "Midwest", 5960975, 34.76, 72108, 65.62549863110198, 2, 1, 1, 2, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 55],
  ["Washington", "D", "West", 7958180, 58.15, 145609, 60.84759493488019, 2, 0, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 50],
  ["Virginia", "R", "South", 8811195, 54.15, 132905, 60.75949432804772, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 50],
  ["Connecticut", "D", "East", 3675069, 25.65, 59062, 60.490117217383805, 2, 0, 1, 0, 0, 0, 0, 1, 0, 2, 1, 1, 1, 1, 0, 50],
  ["Minnesota", "D", "Midwest", 5793151, 42.38, 84904, 59.95905434695267, 0, 1, 1, 0, 3, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 50],
  ["New York", "D", "East", 19867248, 132.02, 246442, 59.71643866295586, 2, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 50],
  ["Hawaii", "D", "West", 1446146, 13.34, 57147, 58.4662614743913, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 45],
  ["Mississippi", "R", "South", 2943045, 7.85, 53217, 57.354827730293216, 0, 1, 1, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 1, 0, 40],
  ["Texas", "R", "South", 31290831, 107.7, 321839, 56.166770290781564, 2, 1, 1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0, 1, 0, 45],
  ["Oklahoma", "R", "West", 4095393, 12.59, 64085, 54.356941838212485, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 40],
  ["Rhode Island", "D", "East", 1112308, 7.29, 20828, 50.393530104353545, 0, 0, 1, 0, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 1, 40],
  ["Vermont", "R", "East", 648493, 5.23, 13892, 50.03704926640376, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 40],
  ["Idaho", "R", "West", 2001619, 5.26, 25871, 48.51185047625841, 0, 0, 1, 2, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 35],
  ["Kentucky", "D", "South", 4588372, 21.78, 80756, 46.363143734443625, 0, 1, 1, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1, 0, 35],
  ["Indiana", "R", "Midwest", 6924275, 29.22, 90541, 45.281885091096306, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 35],
  ["Ohio", "R", "Midwest", 11883304, 47.82, 140813, 45.00864521291297, 2, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 35],
  ["Maine", "D", "East", 1405012, 7.84, 21031, 44.54341746824788, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 35],
  ["Delaware", "D", "East", 1051917, 6.07, 26618, 42.02504452576228, 2, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 30],
  ["North Dakota", "R", "Midwest", 796568, 5.25, 18697, 40.56284598784863, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 30],
  ["South Carolina", "R", "South", 5478831, 26.3, 84756, 39.96175168674869, 0, 0, 1, 2, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 30],
  ["Tennessee", "R", "South", 7227750, 30.61, 79717, 38.864211425796675, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 30],
  ["Iowa", "R", "Midwest", 3241488, 9.74, 51805, 38.14174893288249, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 25],
  ["Puerto Rico", "R", "East", 3203295, 33.3, 117942, 34.98784955684697, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 25],
  ["Guam", "D", "West", 175263, 1.3, 12266, 34.36746174858699, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 15],
  ["Illinois", "D", "Midwest", 12710158, 53, 126926, 32.952137608898454, 2, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 25],
  ["Montana", "R", "West", 1137233, 4.86, 21474, 31.003566659129504, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 20],
  ["New Hampshire", "D", "East", 1409032, 5.2, 18669, 29.533405109457703, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 20],
  ["Arkansas", "R", "South", 3088354, 6.31, 61434, 29.36063568567187, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 10],
  ["Florida", "R", "South", 23372215, 78.58, 183219, 27.299624541063118, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 20],
  ["South Dakota", "R", "South", 924669, 4.06, 14372, 23.90381528625612, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 15],
  ["Kansas", "D", "Midwest", 2970606, 17.3, 60690, 23.84735883615516, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 15],
  ["Nebraska", "R", "Midwest", 2005465, 11.23, 36580, 23.40232008413601, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 15],
  ["Nevada", "D", "West", 3267467, 13.29, 29818, 21.603138259555084, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 15],
  ["West Virginia", "R", "South", 1769979, 9.6, 39211, 19.330032718533946, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 10],
  ["Michigan", "D", "Midwest", 10140459, 46.86, 150967, 17.798651533750792, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 10],
  ["Louisiana", "R", "South", 4597740, 22.64, 74492, 12.3801158661709, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
  ["Alaska", "R", "West", 740133, 8.27, 24680, 11.83700544147731, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
  ["American Samoa", "R", "West", 46029, 0.73, 5121, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Missouri", "R", "Midwest", 6245466, 26.79, 83682, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["New Mexico", "D", "West", 2130256, 10.5, 47170, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Northern Mariana Islands", "R", "West", 50255, 0.16, 4281, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Virgin Islands", "D", "East", 87146, 1.44, 6149, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Wyoming", "R", "West", 587618, 4.45, 12637, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const keys: AiIndexCriterionKey[] = [
  "sandbox",
  "deployment",
  "futureIntentions",
  "aiPlan",
  "enterprisePilot",
  "website",
  "eoLeg",
  "taskForce",
  "aiFte",
  "office",
  "guidance",
  "allowedUse",
  "training",
  "inventory",
  "approval",
];

export const aiIndexStates: AiIndexState[] = rows.map(
  ([state, party, region, population, budgetBillions, workforce, compositeScore, ...scores]) => {
    const criteria = Object.fromEntries(
      keys.map((key, index) => [key, scores[index]]),
    ) as Record<AiIndexCriterionKey, number>;

    return {
      state,
      party,
      region,
      population,
      budgetBillions,
      workforce,
      compositeScore,
      preparednessScore: scores[15],
      criteria,
    };
  },
);

export const aiIndexCriteria: Array<{
  key: AiIndexCriterionKey;
  label: string;
  category: "GenAI Adoption" | "Government Infrastructure" | "Employee Policy";
  max: number;
}> = [
  { key: "sandbox", label: "Sandbox", category: "GenAI Adoption", max: 2 },
  { key: "deployment", label: "Deployment", category: "GenAI Adoption", max: 1 },
  { key: "futureIntentions", label: "Future plans", category: "GenAI Adoption", max: 1 },
  { key: "aiPlan", label: "Action plan", category: "GenAI Adoption", max: 2 },
  { key: "enterprisePilot", label: "Enterprise pilot", category: "GenAI Adoption", max: 3 },
  { key: "website", label: "GenAI website", category: "Government Infrastructure", max: 1 },
  { key: "eoLeg", label: "EO or law", category: "Government Infrastructure", max: 1 },
  { key: "taskForce", label: "Task force", category: "Government Infrastructure", max: 1 },
  { key: "aiFte", label: "Dedicated FTE", category: "Government Infrastructure", max: 1 },
  { key: "office", label: "AI office", category: "Government Infrastructure", max: 2 },
  { key: "guidance", label: "Guidance", category: "Employee Policy", max: 1 },
  { key: "allowedUse", label: "Allowed use", category: "Employee Policy", max: 1 },
  { key: "training", label: "Training", category: "Employee Policy", max: 1 },
  { key: "inventory", label: "Inventory", category: "Employee Policy", max: 1 },
  { key: "approval", label: "Approval system", category: "Employee Policy", max: 1 },
];

export const aiIndexSources = [
  {
    label: "GenAI Benchmark Data",
    href: "https://docs.google.com/spreadsheets/d/1BhOYYJF75hnKdcfi5IejWD8tHovsdnay/edit?gid=804851104#gid=804851104",
  },
  {
    label: "Methodology and Background",
    href: "https://docs.google.com/document/d/1jvnT2yJo47LchswQmj4DRZGEHYOoMGZB/edit",
  },
  {
    label: "Recommendations to State Leaders",
    href: "https://docs.google.com/document/d/1z1hLEEtHXN6JlZp3XSpEGSV2wMdmoTHD/edit",
  },
  {
    label: "Executive Summary Presentation",
    href: "https://docs.google.com/presentation/d/1jAaItGFd-F7s-wUSZRsxjfbmZnqmAT5V/edit?slide=id.p1#slide=id.p1",
  },
];
