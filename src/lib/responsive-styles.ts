/**
 * Comprehensive responsive style utilities for the Aarunya website
 */

// Screen size breakpoints (matching Tailwind defaults)
export const SCREEN_SIZES = {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const;

// Responsive font sizes
export const RESPONSIVE_FONTS = {
    // Headings
    h1: {
        xs: 'text-4xl',
        sm: 'text-5xl',
        md: 'text-6xl',
        lg: 'text-7xl',
        xl: 'text-8xl',
        '2xl': 'text-9xl'
    },
    h2: {
        xs: 'text-3xl',
        sm: 'text-4xl',
        md: 'text-5xl',
        lg: 'text-6xl',
        xl: 'text-7xl',
        '2xl': 'text-8xl'
    },
    h3: {
        xs: 'text-2xl',
        sm: 'text-3xl',
        md: 'text-4xl',
        lg: 'text-5xl',
        xl: 'text-6xl',
        '2xl': 'text-7xl'
    },
    // Body text
    body: {
        xs: 'text-sm',
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl'
    },
    // Small text
    small: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
    },
    // Navigation
    nav: {
        xs: 'text-[8px]',
        sm: 'text-[9px]',
        md: 'text-[10px]',
        lg: 'text-[11px]',
        xl: 'text-[12px]',
        '2xl': 'text-[14px]'
    }
};

// Responsive spacing
export const RESPONSIVE_SPACING = {
    padding: {
        xs: 'p-4',
        sm: 'p-6',
        md: 'p-8',
        lg: 'p-10',
        xl: 'p-12',
        '2xl': 'p-16'
    },
    margin: {
        xs: 'm-2',
        sm: 'm-4',
        md: 'm-6',
        lg: 'm-8',
        xl: 'm-10',
        '2xl': 'm-12'
    },
    gap: {
        xs: 'gap-2',
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-10',
        '2xl': 'gap-12'
    }
};

// Responsive layout classes
export const RESPONSIVE_LAYOUT = {
    container: {
        xs: 'w-full px-4',
        sm: 'w-full px-6',
        md: 'w-full px-8',
        lg: 'max-w-4xl mx-auto px-10',
        xl: 'max-w-6xl mx-auto px-12',
        '2xl': 'max-w-7xl mx-auto px-16'
    },
    grid: {
        xs: 'grid-cols-1',
        sm: 'grid-cols-2',
        md: 'grid-cols-3',
        lg: 'grid-cols-4',
        xl: 'grid-cols-5',
        '2xl': 'grid-cols-6'
    },
    columns: {
        xs: 'col-span-1',
        sm: 'col-span-2',
        md: 'col-span-3',
        lg: 'col-span-4',
        xl: 'col-span-5',
        '2xl': 'col-span-6'
    }
};

// Responsive height classes
export const RESPONSIVE_HEIGHT = {
    full: {
        xs: 'h-screen',
        sm: 'h-screen',
        md: 'h-screen',
        lg: 'h-screen',
        xl: 'h-screen',
        '2xl': 'h-screen'
    },
    section: {
        xs: 'min-h-[60vh]',
        sm: 'min-h-[70vh]',
        md: 'min-h-[80vh]',
        lg: 'min-h-[90vh]',
        xl: 'min-h-screen',
        '2xl': 'min-h-screen'
    }
};

// Responsive width classes
export const RESPONSIVE_WIDTH = {
    button: {
        xs: 'w-full',
        sm: 'w-auto',
        md: 'w-auto',
        lg: 'w-auto',
        xl: 'w-auto',
        '2xl': 'w-auto'
    },
    card: {
        xs: 'w-full',
        sm: 'w-[90%]',
        md: 'w-[80%]',
        lg: 'w-[70%]',
        xl: 'w-[60%]',
        '2xl': 'w-[50%]'
    }
};

// Responsive animation classes
export const RESPONSIVE_ANIMATIONS = {
    subtle: {
        xs: 'animate-fade-in',
        sm: 'animate-fade-in',
        md: 'animate-slide-in-up',
        lg: 'animate-slide-in-up',
        xl: 'animate-scale-in',
        '2xl': 'animate-scale-in'
    },
    intense: {
        xs: 'animate-fade-in',
        sm: 'animate-slide-in-up',
        md: 'animate-slide-in-up',
        lg: 'animate-scale-in',
        xl: 'animate-scale-in',
        '2xl': 'animate-scale-in'
    }
};

// Responsive shadow classes
export const RESPONSIVE_SHADOWS = {
    subtle: {
        xs: 'shadow-sm',
        sm: 'shadow-md',
        md: 'shadow-lg',
        lg: 'shadow-xl',
        xl: 'shadow-2xl',
        '2xl': 'shadow-3xl'
    },
    neon: {
        xs: 'shadow-neon',
        sm: 'shadow-neon',
        md: 'shadow-neon-intense',
        lg: 'shadow-neon-intense',
        xl: 'shadow-neon-intense',
        '2xl': 'shadow-neon-intense'
    }
};

// Utility function to get responsive classes
export const getResponsiveClasses = (
    baseClasses: string,
    responsiveClasses: Record<string, string>
): string => {
    const screenSize = getScreenSize();
    const responsiveClass = responsiveClasses[screenSize];
    return `${baseClasses} ${responsiveClass || ''}`.trim();
};

// Utility function to get current screen size
export const getScreenSize = (): keyof typeof SCREEN_SIZES => {
    const width = window.innerWidth;

    if (width < SCREEN_SIZES.sm) return 'xs';
    if (width < SCREEN_SIZES.md) return 'sm';
    if (width < SCREEN_SIZES.lg) return 'md';
    if (width < SCREEN_SIZES.xl) return 'lg';
    if (width < SCREEN_SIZES['2xl']) return 'xl';
    return '2xl';
};

// Utility function to check if screen size matches
export const isScreenSize = (size: keyof typeof SCREEN_SIZES): boolean => {
    const currentSize = getScreenSize();
    return currentSize === size;
};

// Utility function to check if screen size is at least the specified size
export const isScreenSizeAtLeast = (size: keyof typeof SCREEN_SIZES): boolean => {
    const currentSize = getScreenSize();
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    const currentIdx = sizes.indexOf(currentSize);
    const targetIdx = sizes.indexOf(size);
    return currentIdx >= targetIdx;
};

// Utility function to check if screen size is at most the specified size
export const isScreenSizeAtMost = (size: keyof typeof SCREEN_SIZES): boolean => {
    const currentSize = getScreenSize();
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    const currentIdx = sizes.indexOf(currentSize);
    const targetIdx = sizes.indexOf(size);
    return currentIdx <= targetIdx;
};

// CSS-in-JS responsive styles
export const getResponsiveStyle = (baseStyle: React.CSSProperties, responsiveStyles: Record<string, React.CSSProperties>): React.CSSProperties => {
    const screenSize = getScreenSize();
    const responsiveStyle = responsiveStyles[screenSize];
    return { ...baseStyle, ...responsiveStyle };
};

// Media query helper
export const createMediaQuery = (minWidth: number, maxWidth?: number): string => {
    if (maxWidth) {
        return `@media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
    }
    return `@media (min-width: ${minWidth}px)`;
};

// Breakpoint media queries
export const MEDIA_QUERIES = {
    xs: createMediaQuery(0, SCREEN_SIZES.sm - 1),
    sm: createMediaQuery(SCREEN_SIZES.sm, SCREEN_SIZES.md - 1),
    md: createMediaQuery(SCREEN_SIZES.md, SCREEN_SIZES.lg - 1),
    lg: createMediaQuery(SCREEN_SIZES.lg, SCREEN_SIZES.xl - 1),
    xl: createMediaQuery(SCREEN_SIZES.xl, SCREEN_SIZES['2xl'] - 1),
    '2xl': createMediaQuery(SCREEN_SIZES['2xl']),

    // Range queries
    smAndUp: createMediaQuery(SCREEN_SIZES.sm),
    mdAndUp: createMediaQuery(SCREEN_SIZES.md),
    lgAndUp: createMediaQuery(SCREEN_SIZES.lg),
    xlAndUp: createMediaQuery(SCREEN_SIZES.xl),

    smAndDown: createMediaQuery(0, SCREEN_SIZES.md - 1),
    mdAndDown: createMediaQuery(0, SCREEN_SIZES.lg - 1),
    lgAndDown: createMediaQuery(0, SCREEN_SIZES.xl - 1),
    xlAndDown: createMediaQuery(0, SCREEN_SIZES['2xl'] - 1),
};


// Responsive image sizes
export const RESPONSIVE_IMAGE_SIZES = {
    xs: 'w-full h-auto',
    sm: 'w-full h-auto',
    md: 'w-[80%] h-auto',
    lg: 'w-[60%] h-auto',
    xl: 'w-[50%] h-auto',
    '2xl': 'w-[40%] h-auto'
};

// Responsive button sizes
export const RESPONSIVE_BUTTON_SIZES = {
    xs: 'px-4 py-2 text-sm',
    sm: 'px-6 py-3 text-base',
    md: 'px-8 py-4 text-lg',
    lg: 'px-10 py-5 text-xl',
    xl: 'px-12 py-6 text-2xl',
    '2xl': 'px-14 py-7 text-3xl'
};

// Responsive card padding
export const RESPONSIVE_CARD_PADDING = {
    xs: 'p-4',
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
    xl: 'p-12',
    '2xl': 'p-16'
};

// Responsive navigation height
export const RESPONSIVE_NAV_HEIGHT = {
    xs: 'h-16',
    sm: 'h-20',
    md: 'h-24',
    lg: 'h-28',
    xl: 'h-32',
    '2xl': 'h-36'
};

// Responsive font scaling
export const scaleFontSize = (baseSize: number, factor: number = 1): number => {
    const screenSize = getScreenSize();
    const multipliers = {
        xs: 0.8,
        sm: 0.9,
        md: 1.0,
        lg: 1.1,
        xl: 1.2,
        '2xl': 1.3
    };

    return baseSize * multipliers[screenSize] * factor;
};

// Responsive spacing scaling
export const scaleSpacing = (baseSpacing: number, factor: number = 1): number => {
    const screenSize = getScreenSize();
    const multipliers = {
        xs: 0.5,
        sm: 0.75,
        md: 1.0,
        lg: 1.25,
        xl: 1.5,
        '2xl': 1.75
    };

    return baseSpacing * multipliers[screenSize] * factor;
};