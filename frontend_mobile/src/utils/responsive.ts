import { useWindowDimensions, type DimensionValue } from "react-native";

/** Below this width the layout behaves as a phone. */
export const TABLET_BREAKPOINT = 600;

/** Tablet landscape / small desktop: grids may add columns. */
export const TABLET_LANDSCAPE_BREAKPOINT = 1024;

/**
 * Hard readability cap for very wide screens. Content grows fluidly with the
 * viewport up to this cap, so tablet landscape fills the available width
 * instead of staying stuck in a narrow centered column.
 */
export const MAX_CONTENT_WIDTH = 1200;

export function isTablet(width: number): boolean {
  return width >= TABLET_BREAKPOINT;
}

export function isTabletLandscape(width: number): boolean {
  return width >= TABLET_LANDSCAPE_BREAKPOINT;
}

/**
 * Content width for tablet/desktop layouts: grows with the viewport up to the
 * readability cap instead of being pinned to a small fixed width.
 */
export function tabletContentWidth(width: number): number {
  return Math.min(width, MAX_CONTENT_WIDTH);
}

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a font size scaled between phone and tablet breakpoints.
 * The scalar range [minScale, maxScale] is interpolated across the
 * device width up to the tablet breakpoint.
 *
 * NOTE: This calls `useWindowDimensions()` internally, so it must follow
 * the Rules of Hooks. It is named `useResponsiveFontSize` (not
 * `responsiveFontSize`) so the React Compiler recognises it as a hook and
 * never reorders or drops the underlying hook call.
 */
export function useResponsiveFontSize(base: number, minScale = 0.8, maxScale = 1.15): number {
  const { width } = useWindowDimensions();
  if (width >= TABLET_BREAKPOINT) {
    return Math.round(base * maxScale);
  }
  const progress = width / TABLET_BREAKPOINT;
  const scale = clamp(minScale + (maxScale - minScale) * progress, minScale, maxScale);
  return Math.round(base * scale);
}

/**
 * Returns the horizontal content gutter. On phones every surface already
 * applies its own padding; on tablets `useResponsiveContainer` centers the
 * content, so the gutter stays constant and this must never be combined with
 * a capped container (that would collapse the content width).
 */
export function useResponsiveHorizontalPadding(): number {
  return 20;
}

/**
 * Returns a self-centring, fluid style object for content containers.
 * On phones it is a no-op so the caller's own padding is respected; on
 * tablets the container fills the available width up to the readability cap.
 */
export function useResponsiveContainer(): Record<string, number | string> {
  const { width } = useWindowDimensions();
  if (width < TABLET_BREAKPOINT) {
    return {};
  }
  return {
    width: "100%",
    maxWidth: tabletContentWidth(width),
    alignSelf: "center",
  };
}

/**
 * Returns a fluid max width for self-contained cards (auth/reset screens)
 * that should stay readable but not feel tiny on tablets.
 */
export function useResponsiveMaxWidth(cap = 480): number {
  const { width } = useWindowDimensions();
  return Math.min(width - 40, cap);
}

/**
 * Mimics CSS `repeat(auto-fit, minmax(...))` for React Native grids:
 * phones keep `smallScreenColumns`, tablets fill the available content width
 * with columns that are at least `minCardWidth` wide.
 *
 * Example: project cards on a 1024px tablet landscape →
 * `Math.floor((1024 - 40) / 360) = 2` columns; on 1280px → 3 columns.
 */
export function useResponsiveColumns(minCardWidth: number, smallScreenColumns = 1): number {
  const { width } = useWindowDimensions();
  if (width < TABLET_BREAKPOINT) {
    return smallScreenColumns;
  }
  const available = Math.min(width, MAX_CONTENT_WIDTH) - 40;
  return Math.max(smallScreenColumns, Math.floor(available / minCardWidth));
}

/**
 * Grid cell sizing so items fill a row of `columns` evenly with a consistent
 * gutter. Pair with a wrapping row that owns `paddingHorizontal`.
 */
export function gridCellStyle(columns: number, gutter: number): { width: DimensionValue; paddingHorizontal: number } {
  return {
    width: `${100 / columns}%` as DimensionValue,
    paddingHorizontal: gutter / 2,
  };
}