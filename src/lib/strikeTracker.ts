export const strikeTrackerNames = ["Ricky", "Perry", "John", "Yasser", "Isaac"] as const;

export type StrikeTrackerName = (typeof strikeTrackerNames)[number];
export type StrikeTrackerCounts = Record<StrikeTrackerName, number>;
export type StrikeTrackerMode = "live" | "local";

const LOCAL_COUNTS_KEY = "strike-tracker:counts";
const ACCESS_CODE_KEY = "strike-tracker:access-code";

export const initialStrikeTrackerCounts = strikeTrackerNames.reduce(
  (counts, name) => ({
    ...counts,
    [name]: 0,
  }),
  {} as StrikeTrackerCounts,
);

export function readLocalStrikeTrackerCounts() {
  if (typeof window === "undefined") return initialStrikeTrackerCounts;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(LOCAL_COUNTS_KEY) ?? "{}",
    ) as Partial<StrikeTrackerCounts>;

    return strikeTrackerNames.reduce(
      (counts, name) => ({
        ...counts,
        [name]: Number.isFinite(parsed[name]) ? Number(parsed[name]) : 0,
      }),
      {} as StrikeTrackerCounts,
    );
  } catch {
    return initialStrikeTrackerCounts;
  }
}

export function writeLocalStrikeTrackerCounts(counts: StrikeTrackerCounts) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_COUNTS_KEY, JSON.stringify(counts));
}

function readLocalFallback() {
  return { counts: readLocalStrikeTrackerCounts(), mode: "local" as const };
}

function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Supabase request failed";
}

export async function getStrikeTrackerCounts(): Promise<{
  counts: StrikeTrackerCounts;
  mode: StrikeTrackerMode;
}> {
  try {
    const { counts, mode } = await requestStrikeTracker("read");
    if (mode === "local") return readLocalFallback();
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode };
  } catch {
    return readLocalFallback();
  }
}

export function readStrikeTrackerAccessCode() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ACCESS_CODE_KEY) ?? "";
}

export function writeStrikeTrackerAccessCode(code: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ACCESS_CODE_KEY, code);
}

export function clearStrikeTrackerAccessCode() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACCESS_CODE_KEY);
}

type StrikeTrackerApiAction = "read" | "increment" | "reset";

type StrikeTrackerApiResponse = {
  counts?: StrikeTrackerCounts;
  error?: string;
  mode?: StrikeTrackerMode;
  warning?: string;
};

async function requestStrikeTracker(
  action: StrikeTrackerApiAction,
  payload: Record<string, unknown> = {},
): Promise<{ counts: StrikeTrackerCounts; mode: StrikeTrackerMode; warning?: string }> {
  const response = await fetch("/api/strike-tracker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      code: readStrikeTrackerAccessCode(),
      ...payload,
    }),
  });

  const data = (await response.json()) as StrikeTrackerApiResponse;

  if (!response.ok) {
    throw new Error(data.error || "Strike Tracker request failed");
  }

  if (!data.counts || !data.mode) {
    throw new Error(data.error || "Strike Tracker response was incomplete");
  }

  return { counts: data.counts, mode: data.mode, warning: data.warning };
}

export async function authorizeStrikeTracker(code: string) {
  writeStrikeTrackerAccessCode(code);

  try {
    const result = await requestStrikeTracker("read");
    writeLocalStrikeTrackerCounts(result.counts);
    return result;
  } catch (error) {
    clearStrikeTrackerAccessCode();
    throw error;
  }
}

export async function incrementStrikeCount(name: StrikeTrackerName) {
  try {
    const { counts, mode } = await requestStrikeTracker("increment", { name });
    if (mode === "local") {
      const current = readLocalStrikeTrackerCounts();
      const next = { ...current, [name]: current[name] + 1 };
      writeLocalStrikeTrackerCounts(next);
      return { counts: next, mode };
    }
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode };
  } catch (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }
}

export async function resetStrikeCounts() {
  try {
    const { counts, mode } = await requestStrikeTracker("reset");
    if (mode === "local") {
      writeLocalStrikeTrackerCounts(initialStrikeTrackerCounts);
      return { counts: initialStrikeTrackerCounts, mode };
    }
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode };
  } catch (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }
}
