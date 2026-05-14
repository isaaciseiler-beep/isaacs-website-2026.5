import { describe, expect, it } from "vitest";
import { experienceEntries } from "@/lib/experience";
import { buildExperienceExplorerWorld, isWallAt } from "@/lib/experienceGame";

describe("experience explorer world", () => {
  it("turns every experience entry into a walkable exhibit", () => {
    const world = buildExperienceExplorerWorld();

    expect(world.exhibits).toHaveLength(experienceEntries.length);
    expect(world.map).toHaveLength(world.height);
    expect(world.map.every((row) => row.length === world.width)).toBe(true);
  });

  it("keeps the player start and exhibits out of walls", () => {
    const world = buildExperienceExplorerWorld();
    const ids = world.exhibits.map((exhibit) => exhibit.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(isWallAt(world, world.start.x, world.start.y)).toBe(false);

    world.exhibits.forEach((exhibit) => {
      expect(isWallAt(world, exhibit.x, exhibit.y)).toBe(false);
      expect(exhibit.x).toBeGreaterThan(0);
      expect(exhibit.x).toBeLessThan(world.width);
      expect(exhibit.y).toBeGreaterThan(0);
      expect(exhibit.y).toBeLessThan(world.height);
    });
  });
});
