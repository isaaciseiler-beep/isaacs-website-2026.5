import {
  createClient,
  type RealtimeChannel,
  type SupabaseClient,
} from "@supabase/supabase-js";

export const strikeTrackerNames = ["Ricky", "Perry", "John", "Yasser", "Isaac"] as const;

export type StrikeTrackerName = (typeof strikeTrackerNames)[number];
export type StrikeTrackerCounts = Record<StrikeTrackerName, number>;
export type StrikeTrackerMode = "live" | "local";

const LOCAL_COUNTS_KEY = "strike-tracker:counts";
const SUPABASE_TABLE = "strike_tracker_counts";

let supabaseClient: SupabaseClient | null = null;

export const initialStrikeTrackerCounts = strikeTrackerNames.reduce(
  (counts, name) => ({
    ...counts,
    [name]: 0,
  }),
  {} as StrikeTrackerCounts,
);

function hasSupabaseConfig() {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}

function getSupabaseClient() {
  if (!hasSupabaseConfig()) return null;

  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  }

  return supabaseClient;
}

function normalizeCounts(rows: Array<{ name: string; count: number }> = []) {
  return strikeTrackerNames.reduce(
    (counts, name) => ({
      ...counts,
      [name]: Number(rows.find((row) => row.name === name)?.count ?? 0),
    }),
    {} as StrikeTrackerCounts,
  );
}

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

export async function getStrikeTrackerCounts(): Promise<{
  counts: StrikeTrackerCounts;
  mode: StrikeTrackerMode;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { counts: readLocalStrikeTrackerCounts(), mode: "local" };
  }

  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("name, count")
      .order("name", { ascending: true });

    if (error) return readLocalFallback();

    const counts = normalizeCounts(data ?? []);
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode: "live" };
  } catch {
    return readLocalFallback();
  }
}

export async function incrementStrikeCount(name: StrikeTrackerName) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const current = readLocalStrikeTrackerCounts();
    const next = { ...current, [name]: current[name] + 1 };
    writeLocalStrikeTrackerCounts(next);
    return { counts: next, mode: "local" as const };
  }

  try {
    const { data, error } = await supabase.rpc("increment_strike_count", {
      strike_name: name,
    });

    if (error) {
      const current = readLocalStrikeTrackerCounts();
      const next = { ...current, [name]: current[name] + 1 };
      writeLocalStrikeTrackerCounts(next);
      return { counts: next, mode: "local" as const };
    }

    const counts = normalizeCounts(data ?? []);
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode: "live" as const };
  } catch {
    const current = readLocalStrikeTrackerCounts();
    const next = { ...current, [name]: current[name] + 1 };
    writeLocalStrikeTrackerCounts(next);
    return { counts: next, mode: "local" as const };
  }
}

export async function resetStrikeCounts() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    writeLocalStrikeTrackerCounts(initialStrikeTrackerCounts);
    return { counts: initialStrikeTrackerCounts, mode: "local" as const };
  }

  try {
    const { data, error } = await supabase.rpc("reset_strike_counts");

    if (error) {
      writeLocalStrikeTrackerCounts(initialStrikeTrackerCounts);
      return { counts: initialStrikeTrackerCounts, mode: "local" as const };
    }

    const counts = normalizeCounts(data ?? []);
    writeLocalStrikeTrackerCounts(counts);
    return { counts, mode: "live" as const };
  } catch {
    writeLocalStrikeTrackerCounts(initialStrikeTrackerCounts);
    return { counts: initialStrikeTrackerCounts, mode: "local" as const };
  }
}

export function subscribeToStrikeTrackerCounts({
  onUpdate,
  onError,
}: {
  onUpdate: (counts: StrikeTrackerCounts) => void;
  onError?: (message: string) => void;
}) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  let refreshTimer: number | null = null;
  let channel: RealtimeChannel | null = supabase
    .channel("strike-tracker:counts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_TABLE },
      () => {
        if (refreshTimer) window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          void getStrikeTrackerCounts()
            .then(({ counts }) => onUpdate(counts))
            .catch((error: Error) => onError?.(error.message));
        }, 80);
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR") {
        onError?.(
          error?.message ??
            "Live Strike Tracker updates are unavailable. This device will keep its local copy.",
        );
      }
    });

  return () => {
    if (refreshTimer) window.clearTimeout(refreshTimer);
    if (!channel) return;
    void supabase.removeChannel(channel);
    channel = null;
  };
}
