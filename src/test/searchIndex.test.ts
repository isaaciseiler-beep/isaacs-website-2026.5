import { describe, expect, it } from "vitest";
import { hasSearchResults, searchSite } from "@/lib/searchIndex";

const titlesFor = (query: string, category: string) =>
  searchSite(query)
    .find((group) => group.category === category)
    ?.results.map((result) => result.title) ?? [];

describe("search index", () => {
  it("ignores stop-word-only queries", () => {
    expect(hasSearchResults(searchSite("and"))).toBe(false);
  });

  it("uses topic expansion for non-exact project language", () => {
    expect(titlesFor("government ai policy", "projects")).toContain("Artificial Intelligence in State Government Index");
  });

  it("finds education work without exact title terms", () => {
    expect(titlesFor("classroom teaching with chatgpt", "projects")).toContain("Fulbright Taiwan Educator Lab with OpenAI Support");
  });

  it("groups photo album matches separately", () => {
    expect(titlesFor("taiwan travel photos", "photos")).toContain("Taiwan");
  });

  it("includes primary site pages in the search index", () => {
    expect(titlesFor("photo map", "pages")).toContain("Photo Map");
    expect(titlesFor("resume timeline", "pages")).toContain("Experience");
  });

  it("surfaces inspiration items through hidden tags", () => {
    expect(titlesFor("compact camera photography", "inspiration")).toContain("Ricoh GRIIIx");
  });

  it("handles conversational government AI queries", () => {
    expect(titlesFor("what did Isaac build for gen AI in state govt", "projects")).toContain(
      "Artificial Intelligence in State Government Index",
    );
  });

  it("understands picture language for photo albums", () => {
    expect(titlesFor("show me pictures from Taipei", "photos")).toContain("Taiwan");
  });
});
