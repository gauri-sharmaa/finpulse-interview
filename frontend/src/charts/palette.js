/**
 * Chart color access.
 *
 * All values live in src/theme.css so light and dark swap in one place; this
 * module just reads them at render time. Never hard-code a hex in a chart.
 */

const read = (token, fallback) => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return v || fallback;
};

/** Categorical slots — for telling distinct series apart. Assign in fixed order. */
export const series = () => ({
  1: read("--series-1", "#2a78d6"),
  2: read("--series-2", "#eb6834"),
});

/** Recessive chrome shared by every chart. */
export const chrome = () => ({
  grid: read("--grid", "#ece9e3"),
  axis: read("--text-muted", "#86847d"),
  surface: read("--surface-1", "#fcfcfb"),
});

/**
 * Sequential blue ramp, darkest first — for encoding MAGNITUDE (one hue,
 * more-is-darker), e.g. ranked bars. Steps are ordinal-safe against both
 * surfaces.
 */
export const sequential = () => [
  read("--seq-650", "#104281"),
  read("--seq-550", "#1c5cab"),
  read("--seq-450", "#2a78d6"),
  read("--seq-350", "#5598e7"),
  read("--seq-250", "#86b6ef"),
];

/**
 * Maps `count` ranked items onto the sequential ramp, darkest = largest.
 * Anything past the ramp's length holds at the lightest legible step.
 */
export const rampFor = (count) => {
  const ramp = sequential();
  return Array.from({ length: count }, (_, i) =>
    ramp[Math.min(Math.round((i / Math.max(count - 1, 1)) * (ramp.length - 1)), ramp.length - 1)]
  );
};
