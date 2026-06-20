import { useEffect, useState } from 'react';

export interface DeviceCapability {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    hasGPU: boolean;
    maxTextureSize: number;
    pixelRatio: number;
    lodLevel: 'low' | 'medium' | 'high';
    maxParticles: number;
}

export function useDeviceCapability(): DeviceCapability {
    const [capability, setCapability] = useState<DeviceCapability>({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        hasGPU: true,
        maxTextureSize: 4096,
        pixelRatio: 1,
        lodLevel: 'high',
        maxParticles: 3000,
    });

    useEffect(() => {
        // Detect device type
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/.test(userAgent);
        const isDesktop = !isMobile && !isTablet;

        // Get WebGL info
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as any;
        
        let maxTextureSize = 4096;
        let hasGPU = true;
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                hasGPU = !renderer.toLowerCase().includes('angle');
            }
            maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        } else {
            hasGPU = false;
        }

        // Determine LOD level based on device capability
        let lodLevel: 'low' | 'medium' | 'high' = 'high';
        let maxParticles = 3000;

        if (isMobile) {
            lodLevel = 'low';
            maxParticles = 200; // Reduced for 60 FPS on mobile
        } else if (isTablet) {
            lodLevel = 'medium';
            maxParticles = 800; // Reduced for better performance
        } else if (isDesktop && !hasGPU) {
            lodLevel = 'medium';
            maxParticles = 1500; // Reduced from 2000
        }

        // Check frame rate capability
        let fps = 60;
        let frameCount = 0;
        const startTime = performance.now();

        const checkFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;

            if (elapsed >= 1000) {
                fps = frameCount;
                // Adjust LOD if FPS is low
                if (fps < 30 && lodLevel === 'high') {
                    lodLevel = 'medium';
                    maxParticles = Math.floor(maxParticles * 0.6);
                } else if (fps < 20 && lodLevel === 'medium') {
                    lodLevel = 'low';
                    maxParticles = Math.floor(maxParticles * 0.4);
                }
            } else {
                requestAnimationFrame(checkFrameRate);
            }
        };

        requestAnimationFrame(checkFrameRate);

        setCapability({
            isMobile,
            isTablet,
            isDesktop,
            hasGPU,
            maxTextureSize,
            pixelRatio: window.devicePixelRatio || 1,
            lodLevel,
            maxParticles,
        });
    }, []);

    return capability;
}
