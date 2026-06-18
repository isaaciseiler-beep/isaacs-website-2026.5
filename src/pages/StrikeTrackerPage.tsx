import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, RotateCcw } from "lucide-react";
import {
  getStrikeTrackerCounts,
  incrementStrikeCount,
  initialStrikeTrackerCounts,
  readLocalStrikeTrackerCounts,
  resetStrikeCounts,
  strikeTrackerNames,
  subscribeToStrikeTrackerCounts,
  type StrikeTrackerCounts,
  type StrikeTrackerMode,
  type StrikeTrackerName,
} from "@/lib/strikeTracker";

const ACCESS_CODE = "9999";
const AUTH_STORAGE_KEY = "strike-tracker:authorized";
const LOCAL_STATUS = "Device cache";
const LIVE_STATUS = "Online";
const POLLING_STATUS = "Online polling";

function getStatusError(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Save failed";
}

const StrikeTrackerPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [storageMode, setStorageMode] = useState<StrikeTrackerMode>("local");
  const [isSaving, setIsSaving] = useState(false);
  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
      window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
    );
  });
  const [counts, setCounts] = useState<StrikeTrackerCounts>(
    readLocalStrikeTrackerCounts,
  );

  const total = useMemo(
    () => strikeTrackerNames.reduce((sum, name) => sum + counts[name], 0),
    [counts],
  );
  const statusPrefix = storageMode === "live" ? "Live sync" : "Local mode";
  const statusDetail =
    syncMessage && syncMessage !== "Local mode" && syncMessage !== "Live sync online"
      ? syncMessage
      : storageMode === "live"
        ? LIVE_STATUS
        : LOCAL_STATUS;

  useEffect(() => {
    document.title = "Strike Tracker";
  }, []);

  useEffect(() => {
    if (!authorized || typeof window === "undefined") return;
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  }, [authorized]);

  useEffect(() => {
    if (!authorized) return;

    let active = true;
    setSyncMessage("Loading shared data...");

    void getStrikeTrackerCounts()
      .then(({ counts: nextCounts, mode }) => {
        if (!active) return;
        setCounts(nextCounts);
        setStorageMode(mode);
        setSyncMessage(mode === "live" ? "Live sync online" : "Local mode");
      })
      .catch(() => {
        if (!active) return;
        setStorageMode("local");
        setSyncMessage(LOCAL_STATUS);
      });

    const unsubscribe = subscribeToStrikeTrackerCounts({
      onUpdate: (nextCounts) => {
        setCounts(nextCounts);
        setStorageMode("live");
        setSyncMessage("Live sync online");
      },
      onError: () => {
        setSyncMessage(POLLING_STATUS);
      },
    });

    const pollingInterval = window.setInterval(() => {
      void getStrikeTrackerCounts().then(({ counts: nextCounts, mode }) => {
        if (!active || mode !== "live") return;
        setCounts(nextCounts);
        setStorageMode("live");
        setSyncMessage((currentMessage) =>
          currentMessage === "Live sync online" ? currentMessage : POLLING_STATUS,
        );
      });
    }, 2500);

    return () => {
      active = false;
      window.clearInterval(pollingInterval);
      unsubscribe();
    };
  }, [authorized]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code === ACCESS_CODE) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setAuthorized(true);
      setError("");
      return;
    }

    setError("Wrong code");
    setCode("");
  };

  const addStrike = async (name: StrikeTrackerName) => {
    setIsSaving(true);
    setSyncMessage(storageMode === "live" ? "Saving..." : "Saving locally...");

    try {
      const { counts: nextCounts, mode } = await incrementStrikeCount(name);
      setCounts(nextCounts);
      setStorageMode(mode);
      setSyncMessage(mode === "live" ? "Live sync online" : "Local mode");
    } catch (saveError) {
      setSyncMessage(`Save failed: ${getStatusError(saveError)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCounts = async () => {
    setIsSaving(true);
    setSyncMessage(storageMode === "live" ? "Resetting..." : "Resetting locally...");

    try {
      const { counts: nextCounts, mode } = await resetStrikeCounts();
      setCounts(nextCounts);
      setStorageMode(mode);
      setSyncMessage(mode === "live" ? "Live sync online" : "Local mode");
    } catch (resetError) {
      setSyncMessage(`Reset failed: ${getStatusError(resetError)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main
      className="min-h-[100svh] overflow-hidden bg-[#0600a8] px-2 py-3 font-mono text-[#101010] sm:px-6"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.26) 1px, transparent 1px)",
        backgroundSize: "24px 24px, 100% 4px",
      }}
    >
      <div className="mx-auto flex min-h-[calc(100svh-1.5rem)] w-full max-w-md flex-col border-2 border-[#f6f6f6] bg-[#b8b8b8] p-1 shadow-[0_0_0_2px_#1b1b1b,8px_8px_0_#000000]">
        <header className="border-2 border-b-[#3f3f3f] border-l-[#f7f7f7] border-r-[#3f3f3f] border-t-[#f7f7f7] bg-[#00007a] px-2 py-2 text-white">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] uppercase leading-none tracking-[0.18em] text-[#f5f5f5]">
              c:\strike\tracker.exe
            </p>
            <div className="grid h-5 w-5 shrink-0 place-items-center border border-b-[#222] border-l-white border-r-[#222] border-t-white bg-[#c6c6c6] text-[10px] leading-none text-[#111]">
              x
            </div>
          </div>
          <h1 className="mt-3 border-2 border-[#f7f129] bg-[#101010] px-2 py-2 text-[2rem] font-black uppercase leading-none tracking-normal text-[#f7f129] shadow-[inset_0_0_0_2px_#ff2ea6] sm:text-5xl">
            Strike Tracker
          </h1>
        </header>

        {!authorized ? (
          <section className="flex flex-1 flex-col justify-center bg-[#d0d0d0] p-3">
            <form
              onSubmit={handleSubmit}
              className="border-2 border-b-[#3f3f3f] border-l-white border-r-[#3f3f3f] border-t-white bg-[#c6c6c6] p-3 shadow-[inset_-2px_-2px_0_#808080,inset_2px_2px_0_#ffffff]"
            >
              <div className="mb-3 border-2 border-[#111] bg-[#080808] px-2 py-3 text-[#38f8ff] shadow-[inset_0_0_10px_rgba(56,248,255,0.35)]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#f7f129]">Access required</p>
                <p className="mt-2 text-xl font-black uppercase leading-none tracking-normal">Enter Code<span className="animate-pulse">_</span></p>
              </div>
              <label htmlFor="strike-code" className="block text-[10px] uppercase tracking-[0.18em]">
                Password
              </label>
              <input
                id="strike-code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="mt-2 h-14 w-full border-2 border-b-white border-l-[#3f3f3f] border-r-white border-t-[#3f3f3f] bg-[#f8f8f8] px-3 text-center text-3xl font-black tracking-[0.25em] text-[#101010] outline-none focus:bg-white"
                autoComplete="off"
                autoFocus
              />
              {error ? (
                <p className="mt-3 border border-[#8b0000] bg-[#f7f129] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8b0000]">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="mt-4 h-14 w-full border-2 border-b-[#222] border-l-white border-r-[#222] border-t-white bg-[#ff2ea6] text-sm font-black uppercase tracking-[0.18em] text-white shadow-[inset_-2px_-2px_0_#8c005a,inset_2px_2px_0_#ff9bdd] active:border-b-white active:border-l-[#222] active:border-r-white active:border-t-[#222] active:shadow-[inset_2px_2px_0_#8c005a]"
              >
                Boot
              </button>
            </form>
          </section>
        ) : (
          <section className="flex flex-1 flex-col bg-[#d0d0d0] p-2">
            <div className="mb-2 grid grid-cols-[1fr_auto] gap-2 border-2 border-b-white border-l-[#404040] border-r-white border-t-[#404040] bg-[#101010] p-2 uppercase text-[#38f8ff] shadow-[inset_0_0_14px_rgba(56,248,255,0.3)]">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-[#f7f129]">Total Strikes</p>
                <p className="mt-1 text-5xl font-black leading-none tracking-normal text-white [text-shadow:2px_2px_0_#ff2ea6]">
                  {total}
                </p>
              </div>
              <button
                type="button"
                aria-label="Reset all counts"
                onClick={handleResetCounts}
                disabled={isSaving}
                className="grid h-14 w-14 place-items-center border-2 border-b-[#222] border-l-white border-r-[#222] border-t-white bg-[#c6c6c6] text-[#101010] shadow-[inset_-2px_-2px_0_#777,inset_2px_2px_0_#fff] active:border-b-white active:border-l-[#222] active:border-r-white active:border-t-[#222] disabled:opacity-60"
              >
                <RotateCcw className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-2">
              {strikeTrackerNames.map((name) => (
                <div
                  key={name}
                  className="grid min-h-[76px] grid-cols-[1fr_72px_62px] items-center gap-2 border-2 border-b-[#4a4a4a] border-l-white border-r-[#4a4a4a] border-t-white bg-[#c6c6c6] p-2 shadow-[inset_-2px_-2px_0_#8a8a8a,inset_2px_2px_0_#f8f8f8]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#00007a]">Contestant</p>
                    <p className="truncate border-l-4 border-[#ff2ea6] pl-2 text-2xl font-black uppercase leading-tight tracking-normal">
                      {name}
                    </p>
                  </div>
                  <div className="border-2 border-b-white border-l-[#202020] border-r-white border-t-[#202020] bg-[#101010] px-2 py-2 text-center text-3xl font-black leading-none text-[#38f8ff] shadow-[inset_0_0_8px_rgba(56,248,255,0.45)]">
                    {counts[name]}
                  </div>
                  <button
                    type="button"
                    aria-label={`Add strike for ${name}`}
                    onClick={() => addStrike(name)}
                    disabled={isSaving}
                    className="grid h-14 w-14 place-items-center border-2 border-b-[#250018] border-l-[#ffb2e4] border-r-[#250018] border-t-[#ffb2e4] bg-[#ff2ea6] text-white shadow-[inset_-2px_-2px_0_#8c005a,inset_2px_2px_0_#ff9bdd] active:border-b-[#ffb2e4] active:border-l-[#250018] active:border-r-[#ffb2e4] active:border-t-[#250018] disabled:opacity-60"
                  >
                    <Plus className="h-8 w-8" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-2">
              <div className="truncate border-2 border-b-white border-l-[#3f3f3f] border-r-white border-t-[#3f3f3f] bg-[#f7f129] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
                {statusPrefix} // {statusDetail}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default StrikeTrackerPage;
