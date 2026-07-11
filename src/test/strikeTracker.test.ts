import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  authorizeStrikeTracker,
  clearStrikeTrackerAccessCode,
  incrementStrikeCount,
  readLocalStrikeTrackerCounts,
  resetStrikeCounts,
} from "@/lib/strikeTracker";

const liveCounts = {
  Ricky: 1,
  Perry: 2,
  John: 3,
  Yasser: 4,
  Isaac: 5,
};

const zeroCounts = {
  Ricky: 0,
  Perry: 0,
  John: 0,
  Yasser: 0,
  Isaac: 0,
};

const makeStorage = () => {
  let store: Record<string, string> = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  } as Storage;
};

describe("Strike Tracker client", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: makeStorage(),
    });
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: makeStorage(),
    });
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearStrikeTrackerAccessCode();
  });

  it("stores the access code only after the server authorizes it", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ counts: liveCounts, mode: "live" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(authorizeStrikeTracker("1234")).resolves.toMatchObject({
      counts: liveCounts,
      mode: "live",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/strike-tracker",
      expect.objectContaining({
        body: JSON.stringify({ action: "read", code: "1234" }),
      }),
    );
  });

  it("falls back to local increment behavior when server storage is local", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(
      new Response(JSON.stringify({ counts: zeroCounts, mode: "local" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await authorizeStrikeTracker("1234");
    const result = await incrementStrikeCount("Ricky");

    expect(result).toEqual({
      counts: {
        Ricky: 1,
        Perry: 0,
        John: 0,
        Yasser: 0,
        Isaac: 0,
      },
      mode: "local",
    });
    expect(readLocalStrikeTrackerCounts().Ricky).toBe(1);
  });

  it("resets local counts when server storage is local", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(
      new Response(JSON.stringify({ counts: zeroCounts, mode: "local" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await authorizeStrikeTracker("1234");
    await incrementStrikeCount("Isaac");
    const result = await resetStrikeCounts();

    expect(result.counts).toEqual({
      Ricky: 0,
      Perry: 0,
      John: 0,
      Yasser: 0,
      Isaac: 0,
    });
  });
});
