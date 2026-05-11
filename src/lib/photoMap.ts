import { albums, albumPhotos, coverFor, type Album } from "@/lib/photoAlbums";

export type PhotoMapEntryKind = "album" | "photo";

export interface PhotoMapEntry {
  id: string;
  kind: PhotoMapEntryKind;
  title: string;
  location: string;
  coordinates: [number, number];
  coverImage: string;
  images: string[];
  albumFolder?: Album["folder"];
  photoIds?: string[];
}

const albumCoordinates: Record<Album["folder"], [number, number]> = {
  Australia: [115.8605, -31.9505],
  GranCanaria: [-15.5474, 27.9202],
  HongKong: [114.1694, 22.3193],
  Iceland: [-19.0208, 64.9631],
  Indonesia: [115.1889, -8.4095],
  Japan: [138.2529, 36.2048],
  Korea: [126.5312, 33.4996],
  NewZealand: [170.5, -44],
  Portugal: [-8.2245, 39.3999],
  Taiwan: [120.9605, 23.6978],
  TaiwanStrait: [119.9499, 26.1602],
  Thailand: [98.3923, 7.8804],
  Vietnam: [105.8342, 21.0278],
};

export const photoMapEntries: PhotoMapEntry[] = albums
  .map((album) => ({
    id: `album-${album.folder}`,
    kind: "album" as const,
    title: album.location,
    location: album.location,
    coordinates: albumCoordinates[album.folder],
    coverImage: coverFor(album),
    images: albumPhotos(album),
    albumFolder: album.folder,
    photoIds: album.photos,
  }))
  .filter((entry) => Boolean(entry.coordinates));

export const photoMapInitialView = {
  center: [105, 26] as [number, number],
  zoom: 1.22,
  pitch: 0,
  bearing: 0,
};
