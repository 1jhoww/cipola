import type { Choice } from "./consent";
import { site } from "./site";

// Ad and analytics tags load only after the visitor opts in (Google Consent
// Mode v2 in basic mode, Meta Pixel with consent revoke/grant). Nothing loads
// while the IDs are empty.

type Fn = (...args: unknown[]) => void;
type Fbq = Fn & { callMethod?: Fn; queue: unknown[]; loaded: boolean; version: string; push: Fbq };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Fn;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const t = site.tracking;
const state: Choice = { analytics: false, marketing: false };
const configured = new Set<string>();

function loadScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
}

function gtag(...args: unknown[]) {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // gtag.js expects the arguments object itself.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
  }
  window.gtag(...args);
}

function configureOnce(id: string) {
  if (configured.has(id)) return;
  configured.add(id);
  gtag("config", id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}

function meta() {
  if (window.fbq) return window.fbq;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = window._fbq = fbq;
  loadScript("https://connect.facebook.net/en_US/fbevents.js");
  return fbq;
}

// Removes first-party cookies left by a tag whose consent was withdrawn.
function clearCookies(prefixes: string[]) {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = ["", host, `.${host}`];
  for (let i = 1; i < parts.length - 1; i++) domains.push(`.${parts.slice(i).join(".")}`);
  document.cookie.split("; ").forEach((c) => {
    const name = c.split("=")[0];
    if (!prefixes.some((p) => name.startsWith(p))) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
    });
  });
}

export function applyConsent(choice: Choice) {
  const revokedAnalytics = state.analytics && !choice.analytics;
  const revokedMarketing = state.marketing && !choice.marketing;
  Object.assign(state, choice);

  if (t.gaId || t.adsId || t.gtmId) {
    const ads = choice.marketing ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
    if (t.gaId && choice.analytics) configureOnce(t.gaId);
    if (t.adsId && choice.marketing) configureOnce(t.adsId);
    if (t.gtmId && (choice.analytics || choice.marketing) && !configured.has(t.gtmId)) {
      configured.add(t.gtmId);
      window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript(`https://www.googletagmanager.com/gtm.js?id=${t.gtmId}`);
    }
  }

  if (t.metaPixelId) {
    if (choice.marketing) {
      const fbq = meta();
      fbq("consent", "grant");
      if (!configured.has(t.metaPixelId)) {
        configured.add(t.metaPixelId);
        fbq("init", t.metaPixelId);
        fbq("track", "PageView");
      }
    } else if (window.fbq) window.fbq("consent", "revoke");
  }

  if (revokedAnalytics) clearCookies(["_ga", "_gid"]);
  if (revokedMarketing) clearCookies(["_gcl", "_fbp", "_fbc"]);
}

// Client-side navigation. GA4 records history changes on its own.
export function trackPageView() {
  if (!state.marketing) return;
  if (t.adsId && configured.has(t.adsId)) gtag("event", "page_view", { send_to: t.adsId });
  if (window.fbq && t.metaPixelId) window.fbq("track", "PageView");
}

// A quote request reached Cipola: counts as a conversion for the campaigns.
export function trackLead() {
  if (state.analytics && t.gaId) gtag("event", "generate_lead");
  if (!state.marketing) return;
  if (t.adsId && t.adsLeadLabel)
    gtag("event", "conversion", { send_to: `${t.adsId}/${t.adsLeadLabel}` });
  if (window.fbq && t.metaPixelId) window.fbq("track", "Lead");
}
