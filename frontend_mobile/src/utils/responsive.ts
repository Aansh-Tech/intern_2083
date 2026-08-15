import { useWindowDimensions } from "react-native";

export const TABLET_BREAKPOINT = 600;
export const MAX_CONTENT_WIDTH = 720;

export function isTablet(width: number): boolean {
  return width >= TABLET_BREAKPOINT;
}

/**
 * Content width for tablet layouts: keeps cards/sections readable
 * instead of stretching edge-to-edge across the whole screen.
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
 * Returns the correct horizontal content margin/padding for a given
 * screen width so tablet layouts are centred and phones keep their gutter.
 */
export function useResponsiveHorizontalPadding(): number {
  const { width } = useWindowDimensions();
  if (width >= TABLET_BREAKPOINT) {
    return Math.max(20, Math.round((width - MAX_CONTENT_WIDTH) / 2));
  }
  return 20;
}

/**
 * Returns a self-centring, capped style object for content containers
 * so they never stretch edge-to-edge on tablets. On phones it is a no-op,
 * so the caller's own horizontal padding/margin is respected and the
 * container keeps its natural full-width stretch.
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