import * as React from "react";

/**
 * Enhanced responsive hooks for comprehensive device detection and responsive design
 */

// Breakpoint definitions (Tailwind defaults)
export const BREAKPOINTS = {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const;

// Device type detection
export const useDeviceType = () => {
    const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop' | 'large-desktop'>('desktop');

    React.useEffect(() => {
        const updateDeviceType = () => {
            const width = window.innerWidth;

            if (width < BREAKPOINTS.md) {
                setDeviceType('mobile');
            } else if (width < BREAKPOINTS.lg) {
                setDeviceType('tablet');
            } else if (width < BREAKPOINTS['2xl']) {
                setDeviceType('desktop');
            } else {
                setDeviceType('large-desktop');
            }
        };

        updateDeviceType();
        const handleResize = () => updateDeviceType();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceType;
};

// Orientation detection
export const useOrientation = () => {
    const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');

    React.useEffect(() => {
        const updateOrientation = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        updateOrientation();
        window.addEventListener('resize', updateOrientation);

        return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    return orientation;
};

// Touch device detection
export const useTouchDevice = () => {
    const [isTouch, setIsTouch] = React.useState(false);

    React.useEffect(() => {
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouch();
        window.addEventListener('resize', checkTouch);

        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    return isTouch;
};

// High DPI/Retina display detection
export const useHighDPI = () => {
    const [isHighDPI, setIsHighDPI] = React.useState(false);

    React.useEffect(() => {
        const checkDPI = () => {
            setIsHighDPI(window.devicePixelRatio > 1);
        };

        checkDPI();
        window.addEventListener('resize', checkDPI);

        return () => window.removeEventListener('resize', checkDPI);
    }, []);

    return isHighDPI;
};

// Network connection quality (for performance optimization)
export const useNetworkQuality = () => {
    const [connection, setConnection] = React.useState<any>(null);

    React.useEffect(() => {
        if ('connection' in navigator) {
            setConnection((navigator as any).connection);
        }
    }, []);

    return connection;
};

// Custom responsive hook that combines all device info
export const useResponsive = () => {
    const deviceType = useDeviceType();
    const orientation = useOrientation();
    const isTouch = useTouchDevice();
    const isHighDPI = useHighDPI();
    const connection = useNetworkQuality();

    return {
        deviceType,
        orientation,
        isTouch,
        isHighDPI,
        connection,
        // Convenience properties
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop' || deviceType === 'large-desktop',
        isLargeDesktop: deviceType === 'large-desktop',
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
        isRetina: isHighDPI,
        isSlowConnection: connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g' || connection?.effectiveType === '3g',
        isFastConnection: connection?.effectiveType === '4g'
    };
};

// Responsive font size hook
export const useResponsiveFontSize = (baseSize: number, minSize: number = 12, maxSize: number = 24) => {
    const [fontSize, setFontSize] = React.useState(baseSize);

    React.useEffect(() => {
        const updateFontSize = () => {
            const width = window.innerWidth;
            // Scale font size based on viewport width
            let newSize = baseSize;

            if (width < BREAKPOINTS.sm) {
                newSize = Math.max(minSize, baseSize * 0.8);
            } else if (width < BREAKPOINTS.md) {
                newSize = Math.max(minSize, baseSize * 0.9);
            } else if (width < BREAKPOINTS.lg) {
                newSize = baseSize;
            } else if (width < BREAKPOINTS.xl) {
                newSize = Math.min(maxSize, baseSize * 1.1);
            } else {
                newSize = Math.min(maxSize, baseSize * 1.2);
            }

            setFontSize(newSize);
        };

        updateFontSize();
        window.addEventListener('resize', updateFontSize);

        return () => window.removeEventListener('resize', updateFontSize);
    }, [baseSize, minSize, maxSize]);

    return fontSize;
};

// Responsive spacing hook
export const useResponsiveSpacing = (baseSpacing: number) => {
    const { deviceType } = useResponsive();

    switch (deviceType) {
        case 'mobile':
            return baseSpacing * 0.5;
        case 'tablet':
            return baseSpacing * 0.75;
        case 'desktop':
            return baseSpacing;
        case 'large-desktop':
            return baseSpacing * 1.25;
        default:
            return baseSpacing;
    }
};

// Debounced resize hook
export const useDebouncedResize = (callback: () => void, delay: number = 250) => {
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [callback, delay]);
};