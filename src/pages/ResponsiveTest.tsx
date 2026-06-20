import React, { useState, useEffect } from 'react';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResponsive } from '@/hooks/use-responsive';
import { RESPONSIVE_FONTS, RESPONSIVE_SPACING, RESPONSIVE_BUTTON_SIZES, RESPONSIVE_LAYOUT } from '@/lib/responsive-styles';

const ResponsiveTest = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const { isMobile, isTablet, isDesktop, isTouch, screenSize } = useResponsive();

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const testCases = [
        {
            title: 'Typography Test',
            description: 'Testing responsive font sizes across different screen sizes',
            tests: [
                { label: 'H1 Heading', className: RESPONSIVE_FONTS.h1[screenSize], content: 'This is a responsive H1 heading' },
                { label: 'H2 Heading', className: RESPONSIVE_FONTS.h2[screenSize], content: 'This is a responsive H2 heading' },
                { label: 'H3 Heading', className: RESPONSIVE_FONTS.h3[screenSize], content: 'This is a responsive H3 heading' },
                { label: 'Body Text', className: RESPONSIVE_FONTS.body[screenSize], content: 'This is responsive body text that scales with screen size' },
                { label: 'Small Text', className: RESPONSIVE_FONTS.small[screenSize], content: 'This is small responsive text' },
                { label: 'Navigation Text', className: RESPONSIVE_FONTS.nav[screenSize], content: 'NAVIGATION ITEM' }
            ]
        },
        {
            title: 'Spacing Test',
            description: 'Testing responsive padding, margin, and gap values',
            tests: [
                { label: 'Padding', className: RESPONSIVE_SPACING.padding[screenSize], content: 'Responsive padding test' },
                { label: 'Margin', className: RESPONSIVE_SPACING.margin[screenSize], content: 'Responsive margin test' },
                { label: 'Gap', className: RESPONSIVE_SPACING.gap[screenSize], content: 'Responsive gap test' }
            ]
        },
        {
            title: 'Button Sizes Test',
            description: 'Testing responsive button sizes',
            tests: [
                { label: 'Button', className: RESPONSIVE_BUTTON_SIZES[screenSize], content: 'Responsive Button' }
            ]
        },
        {
            title: 'Layout Test',
            description: 'Testing responsive layout classes',
            tests: [
                { label: 'Container', className: RESPONSIVE_LAYOUT.container[screenSize], content: 'Responsive container test' },
                { label: 'Grid', className: RESPONSIVE_LAYOUT.grid[screenSize], content: 'Responsive grid test' }
            ]
        }
    ];

    const screenSizeInfo = {
        xs: { label: 'Extra Small', range: '0 - 639px', description: 'Mobile phones' },
        sm: { label: 'Small', range: '640 - 767px', description: 'Small tablets' },
        md: { label: 'Medium', range: '768 - 1023px', description: 'Tablets' },
        lg: { label: 'Large', range: '1024 - 1279px', description: 'Small desktops' },
        xl: { label: 'Extra Large', range: '1280 - 1535px', description: 'Desktops' },
        '2xl': { label: '2 Extra Large', range: '1536px+', description: 'Large desktops' }
    };

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black">
            <MainNavigation />

            {/* Header */}
            <div className="relative pt-32 pb-20 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.1)_0%,transparent_70%)] pointer-events-none" />
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6">
                    RESPONSIVE TEST
                </h1>
                <div className="h-1 w-[120px] bg-primary mx-auto shadow-neon" />
                <p className="mt-6 text-sm font-share-tech text-muted-foreground tracking-[0.4em] uppercase opacity-60 max-w-3xl mx-auto px-6">
                    // TEST RESPONSIVE DESIGN ACROSS ALL SCREEN SIZES
                </p>
            </div>

            <div className="container mx-auto px-6 pb-20">
                {/* Current Screen Info */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-primary">Current Screen Size</CardTitle>
                                <CardDescription>{screenSizeInfo[screenSize].label}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Range: {screenSizeInfo[screenSize].range}</div>
                                    <div className="text-sm text-muted-foreground">Description: {screenSizeInfo[screenSize].description}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-secondary">Window Dimensions</CardTitle>
                                <CardDescription>Current viewport size</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Width: {windowSize.width}px</div>
                                    <div className="text-sm text-muted-foreground">Height: {windowSize.height}px</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-accent">Device Type</CardTitle>
                                <CardDescription>Detected device category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Mobile: {isMobile ? 'Yes' : 'No'}</div>
                                    <div className="text-sm text-muted-foreground">Tablet: {isTablet ? 'Yes' : 'No'}</div>
                                    <div className="text-sm text-muted-foreground">Desktop: {isDesktop ? 'Yes' : 'No'}</div>
                                    <div className="text-sm text-muted-foreground">Touch: {isTouch ? 'Yes' : 'No'}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-primary-glow">Quick Actions</CardTitle>
                                <CardDescription>Test different screen sizes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button
                                        size="sm"
                                        onClick={() => window.open(window.location.href, '_blank')}
                                        className="w-full bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all rounded-none text-[9px] tracking-[0.4em] font-bold"
                                    >
                                        Open in New Tab
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => window.print()}
                                        className="w-full bg-transparent border border-secondary/30 text-secondary hover:bg-secondary hover:text-black transition-all rounded-none text-[9px] tracking-[0.4em] font-bold"
                                    >
                                        Print Test
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* All Screen Sizes Info */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-white mb-8">All Screen Sizes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(screenSizeInfo).map(([size, info]) => (
                            <Card key={size} className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                                <CardHeader>
                                    <CardTitle className={size === screenSize ? "text-primary" : "text-white"}>
                                        {info.label}
                                    </CardTitle>
                                    <CardDescription>{info.range}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">{info.description}</div>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="text-[8px] tracking-widest">
                                                {size.toUpperCase()}
                                            </Badge>
                                            {size === screenSize && (
                                                <Badge className="bg-primary text-black text-[8px] tracking-widest">
                                                    CURRENT
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Responsive Tests */}
                {testCases.map((testCase, index) => (
                    <div key={index} className="mb-16">
                        <h2 className="text-3xl font-black text-white mb-8">{testCase.title}</h2>
                        <p className="text-muted-foreground mb-8">{testCase.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testCase.tests.map((test, testIndex) => (
                                <Card key={testIndex} className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-primary">{test.label}</CardTitle>
                                        <CardDescription>Applied class: {test.className}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`p-4 bg-black/40 border border-white/5 rounded-lg ${test.className}`}>
                                            {test.content}
                                        </div>
                                        <div className="mt-4 text-xs text-muted-foreground">
                                            Current value: {test.className.split(' ').pop()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Interactive Test */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-white mb-8">Interactive Test</h2>
                    <p className="text-muted-foreground mb-8">Resize your browser window to see responsive changes in real-time</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-primary">Real-time Font Test</CardTitle>
                                <CardDescription>Watch text size change as you resize</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <h1 className={`${RESPONSIVE_FONTS.h1[screenSize]} font-black text-primary`}>
                                        Responsive H1 Heading
                                    </h1>
                                    <h2 className={`${RESPONSIVE_FONTS.h2[screenSize]} font-bold text-secondary`}>
                                        Responsive H2 Heading
                                    </h2>
                                    <p className={`${RESPONSIVE_FONTS.body[screenSize]} text-muted-foreground`}>
                                        This paragraph text scales responsively with your screen size. Resize your browser to see the changes.
                                    </p>
                                    <Button className={`${RESPONSIVE_BUTTON_SIZES[screenSize]} bg-primary text-black font-bold`}>
                                        Responsive Button
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-primary">Layout Test</CardTitle>
                                <CardDescription>Grid and container responsiveness</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`${RESPONSIVE_LAYOUT.container[screenSize]} bg-black/40 border border-white/5 rounded-lg p-6`}>
                                    <div className="text-center mb-4 text-primary font-bold">Container Test</div>
                                    <div className={`${RESPONSIVE_LAYOUT.grid[screenSize]} gap-4`}>
                                        <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 text-center">
                                            Grid Item 1
                                        </div>
                                        <div className="bg-accent/20 border border-accent/40 rounded-lg p-4 text-center">
                                            Grid Item 2
                                        </div>
                                        <div className="bg-primary/20 border border-primary/40 rounded-lg p-4 text-center">
                                            Grid Item 3
                                        </div>
                                        <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 text-center">
                                            Grid Item 4
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Performance Notes */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-white mb-8">Performance Notes</h2>
                    <Card className="bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-primary">Responsive Design Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-secondary font-bold">Mobile First</h3>
                                    <p className="text-sm text-muted-foreground">Design starts with mobile devices and scales up, ensuring optimal performance on all devices.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-accent font-bold">Performance Optimized</h3>
                                    <p className="text-sm text-muted-foreground">Uses efficient CSS-in-JS and utility classes to minimize render time and improve user experience.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-primary-glow font-bold">Accessibility</h3>
                                    <p className="text-sm text-muted-foreground">Responsive design improves accessibility by adapting to different screen sizes and user preferences.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-white mb-4">How to Test</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
                        <div className="space-y-2">
                            <div className="text-primary font-bold">1. Browser DevTools</div>
                            <p>Use Chrome/Firefox dev tools to simulate different device sizes</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-secondary font-bold">2. Manual Resize</div>
                            <p>Drag your browser window edges to see real-time responsive changes</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-accent font-bold">3. Device Testing</div>
                            <p>Test on actual mobile devices, tablets, and desktop computers</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
    );
};

export default ResponsiveTest;