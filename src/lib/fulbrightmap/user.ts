const ANONYMOUS_USER_KEY = "fulbrightmap.anonymousUserId";

function makeAnonymousUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getAnonymousUserId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(ANONYMOUS_USER_KEY);
  if (existing) return existing;

  const next = makeAnonymousUserId();
  window.localStorage.setItem(ANONYMOUS_USER_KEY, next);
  return next;
}
