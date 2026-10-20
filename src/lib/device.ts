// What this browser can comfortably run. Read once on the client.
//
//   "full"   WebGL with hardware acceleration and no data or memory limits
//   "lite"   WebGL works, but the device asked to save data, has little memory
//            or renders WebGL in software: 3D still loads, with lighter rendering
//   "none"   no WebGL at all: the static image is the only view
export type Tier = "full" | "lite" | "none";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

let cached: Tier | null = null;

function webgl(failIfSlow: boolean) {
  try {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: failIfSlow };
    const gl =
      canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
    (gl as WebGLRenderingContext | null)
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export function deviceTier(): Tier {
  if (cached) return cached;
  const nav = navigator as NavigatorHints;
  if (!webgl(false)) cached = "none";
  else if (
    nav.connection?.saveData ||
    /(^|-)2g$/.test(nav.connection?.effectiveType ?? "") ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    !webgl(true)
  )
    cached = "lite";
  else cached = "full";
  return cached;
}

// Low-end Android and data saver: scroll-scrubbed effects are skipped there.
// Safari exposes neither hint, so iPhones keep every animation.
export function prefersLightMotion() {
  const nav = navigator as NavigatorHints;
  return (
    !!nav.connection?.saveData ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  );
}
