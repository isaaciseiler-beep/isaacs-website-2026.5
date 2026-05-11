import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { compressImage, compressImageToDataUrl } from "./image";
import type { Pin, PinInput, StorageMode } from "./types";

const LOCAL_PINS_KEY = "fulbrightmap.pins";
const LOCAL_DELETE_TOKENS_KEY = "fulbrightmap.deleteTokens";
const SUPABASE_IMAGE_BUCKET = "fulbrightmap-pin-images";

let supabaseClient: SupabaseClient | null = null;

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

function fromDatabase(row: {
  id: string;
  lat: number;
  lng: number;
  author_name: string;
  place_name: string;
  caption: string;
  image_url: string;
  anonymous_user_id: string;
  created_at: string;
}): Pin {
  return {
    id: row.id,
    lat: row.lat,
    lng: row.lng,
    authorName: row.author_name,
    placeName: row.place_name,
    caption: row.caption,
    imageUrl: row.image_url,
    anonymousUserId: row.anonymous_user_id,
    createdAt: row.created_at,
  };
}

function toDatabase(input: PinInput) {
  return {
    lat: input.lat,
    lng: input.lng,
    author_name: input.authorName,
    place_name: input.placeName,
    caption: input.caption,
    image_url: input.imageUrl,
    anonymous_user_id: input.anonymousUserId,
  };
}

function readLocalDeleteTokens() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(LOCAL_DELETE_TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeLocalDeleteTokens(tokens: Record<string, string>) {
  window.localStorage.setItem(LOCAL_DELETE_TOKENS_KEY, JSON.stringify(tokens));
}

function rememberDeleteToken(pinId: string, token: string) {
  writeLocalDeleteTokens({
    ...readLocalDeleteTokens(),
    [pinId]: token,
  });
}

function forgetDeleteToken(pinId: string) {
  const tokens = readLocalDeleteTokens();
  delete tokens[pinId];
  writeLocalDeleteTokens(tokens);
}

function getDeleteToken(pinId: string) {
  return readLocalDeleteTokens()[pinId] ?? null;
}

function makeDeleteToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `delete_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readLocalPins() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_PINS_KEY);
    return raw ? (JSON.parse(raw) as Pin[]) : [];
  } catch {
    return [];
  }
}

function writeLocalPins(pins: Pin[]) {
  window.localStorage.setItem(LOCAL_PINS_KEY, JSON.stringify(pins));
}

export function getStorageMode(): StorageMode {
  return hasSupabaseConfig() ? "supabase" : "local";
}

export function canDeletePin(pin: Pin, anonymousUserId: string) {
  return pin.anonymousUserId === anonymousUserId || Boolean(getDeleteToken(pin.id));
}

export async function getPins(): Promise<Pin[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return readLocalPins();

  const { data, error } = await supabase
    .from("pins")
    .select(
      "id, lat, lng, author_name, place_name, caption, image_url, anonymous_user_id, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(fromDatabase);
}

export async function uploadImage(file: File, anonymousUserId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return compressImageToDataUrl(file);
  }

  const compressed = await compressImage(file);
  const path = `${anonymousUserId}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from(SUPABASE_IMAGE_BUCKET)
    .upload(path, compressed, {
      cacheControl: "31536000",
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(SUPABASE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createPin(input: PinInput): Promise<Pin> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const pin: Pin = {
      ...input,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    const pins = [pin, ...readLocalPins()];
    writeLocalPins(pins);
    return pin;
  }

  const deleteToken = makeDeleteToken();
  const deleteTokenHash = await sha256Hex(deleteToken);

  const { data, error } = await supabase
    .from("pins")
    .insert({
      ...toDatabase(input),
      delete_token_hash: deleteTokenHash,
    })
    .select(
      "id, lat, lng, author_name, place_name, caption, image_url, anonymous_user_id, created_at",
    )
    .single();

  if (error) throw new Error(error.message);
  const pin = fromDatabase(data);
  rememberDeleteToken(pin.id, deleteToken);
  return pin;
}

export async function deletePin(id: string, anonymousUserId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    writeLocalPins(
      readLocalPins().filter(
        (pin) => pin.id !== id || pin.anonymousUserId !== anonymousUserId,
      ),
    );
    forgetDeleteToken(id);
    return;
  }

  const deleteToken = getDeleteToken(id);
  const { data, error } = await supabase.rpc("delete_pin", {
    pin_id: id,
    delete_token: deleteToken ?? "",
    requester_anonymous_user_id: anonymousUserId,
  });

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error("This spot could not be deleted. It may have already been removed.");
  }

  forgetDeleteToken(id);
}
