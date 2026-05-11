export type Pin = {
  id: string;
  lat: number;
  lng: number;
  authorName: string;
  placeName: string;
  caption: string;
  imageUrl: string;
  anonymousUserId: string;
  createdAt: string;
};

export type PinInput = {
  lat: number;
  lng: number;
  authorName: string;
  placeName: string;
  caption: string;
  imageUrl: string;
  anonymousUserId: string;
};

export type PendingLocation = {
  lat: number;
  lng: number;
};

export type StorageMode = "supabase" | "local";
