import { experienceEntries, type ExperienceEntry } from "@/lib/experience";

export interface ExperienceExhibit {
  id: string;
  organization: string;
  role: string;
  period: string;
  image: string;
  blurb: string;
  focus: string[];
  artifactCount: number;
  x: number;
  y: number;
  angle: number;
  color: string;
}

export interface ExplorerStart {
  x: number;
  y: number;
  angle: number;
}

export interface ExperienceExplorerWorld {
  map: string[];
  width: number;
  height: number;
  tileSize: number;
  start: ExplorerStart;
  exhibits: ExperienceExhibit[];
}

const EXHIBIT_COLORS = ["#d7ff4f", "#35e5c2", "#ff745f", "#f7b955", "#91d7ff", "#f2f0e8"];

const GALLERY_MAP = [
  "111111111111111111111",
  "100000000010000000001",
  "100000000010000000001",
  "100011100000001110001",
  "100000000000000000001",
  "100000111011100000001",
  "100000000000000000001",
  "111100000000000001111",
  "100000000000000000001",
  "100000111011100000001",
  "100000000000000000001",
  "100011100000001110001",
  "100000000010000000001",
  "100000000010000000001",
  "111111111111111111111",
];

const EXHIBIT_POSITIONS = [
  { x: 3.5, y: 2.15, angle: Math.PI * 0.5 },
  { x: 8.35, y: 2.15, angle: Math.PI * 0.5 },
  { x: 12.65, y: 2.15, angle: Math.PI * 0.5 },
  { x: 17.5, y: 2.15, angle: Math.PI * 0.5 },
  { x: 2.15, y: 5.35, angle: 0 },
  { x: 18.85, y: 5.35, angle: Math.PI },
  { x: 5.15, y: 7.5, angle: 0 },
  { x: 15.85, y: 7.5, angle: Math.PI },
  { x: 2.15, y: 9.65, angle: 0 },
  { x: 18.85, y: 9.65, angle: Math.PI },
  { x: 3.5, y: 12.85, angle: -Math.PI * 0.5 },
  { x: 9.35, y: 12.85, angle: -Math.PI * 0.5 },
  { x: 17.5, y: 12.85, angle: -Math.PI * 0.5 },
];

export const buildExperienceExplorerWorld = (
  entries: ExperienceEntry[] = experienceEntries,
): ExperienceExplorerWorld => {
  const exhibits = entries.map((entry, index): ExperienceExhibit => {
    const position = EXHIBIT_POSITIONS[index % EXHIBIT_POSITIONS.length];

    return {
      id: entry.id,
      organization: entry.organization,
      role: entry.role,
      period: entry.period,
      image: entry.image,
      blurb: entry.paragraphs[0] ?? "",
      focus: entry.focus,
      artifactCount: entry.projectIds.length + entry.newsIds.length,
      x: position.x,
      y: position.y,
      angle: position.angle,
      color: EXHIBIT_COLORS[index % EXHIBIT_COLORS.length],
    };
  });

  return {
    map: GALLERY_MAP,
    width: GALLERY_MAP[0].length,
    height: GALLERY_MAP.length,
    tileSize: 1,
    start: { x: 10.5, y: 7.5, angle: 0 },
    exhibits,
  };
};

export const isWallAt = (world: ExperienceExplorerWorld, x: number, y: number) => {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);

  if (mapX < 0 || mapY < 0 || mapX >= world.width || mapY >= world.height) {
    return true;
  }

  return world.map[mapY]?.[mapX] !== "0";
};
