import * as React from "react";
import { useResponsive } from "./use-responsive";

/**
 * Enhanced mobile detection hook with better performance and integration
 * @deprecated Use useResponsive() instead for more comprehensive device detection
 */
export function useIsMobile() {
  const { isMobile } = useResponsive();
  return isMobile;
}

/**
 * Legacy mobile detection hook for backward compatibility
 * @deprecated Use useResponsive() instead
 */
export function useIsMobileLegacy() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const MOBILE_BREAKPOINT = 768;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
