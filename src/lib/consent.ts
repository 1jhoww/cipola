// Cookie consent record (LGPD). Stored in a first-party cookie so the choice
// survives visits; bumping CONSENT_VERSION asks every visitor again.
export type Choice = { analytics: boolean; marketing: boolean };
export type Consent = Choice & { at: string; v: number };

export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = "cipola_consent";
const MAX_AGE = 60 * 60 * 24 * 365;
const CHANGE_EVENT = "cipola:consent-change";
export const OPEN_PREFERENCES_EVENT = "cipola:cookie-preferences";

export function readConsentRaw(): string {
  const entry = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)) : "";
}

export function parseConsent(raw: string): Consent | null {
  try {
    const c = JSON.parse(raw) as Partial<Consent>;
    if (c.v !== CONSENT_VERSION || typeof c.at !== "string") return null;
    return { analytics: !!c.analytics, marketing: !!c.marketing, at: c.at, v: c.v };
  } catch {
    return null;
  }
}

export function saveConsent(choice: Choice) {
  const record: Consent = {
    ...choice,
    at: new Date().toISOString(),
    v: CONSENT_VERSION,
  };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(record),
  )}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
