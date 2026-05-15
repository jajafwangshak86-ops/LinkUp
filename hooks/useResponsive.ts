import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints (matches Tailwind defaults):
 *  sm  ≥ 640
 *  md  ≥ 768
 *  lg  ≥ 1024
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 375;   // small phones (SE, etc.)
  const isMedium = width >= 375 && width < 768;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  /** Pick a value based on screen size: small | medium | tablet */
  function rs<T>(small: T, medium: T, tablet?: T): T {
    if (isTablet && tablet !== undefined) return tablet;
    if (isSmall) return small;
    return medium;
  }

  return { width, height, isSmall, isMedium, isTablet, isLandscape, rs };
}
