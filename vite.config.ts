import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8040,
        allowedHosts: [
            "aarunya.in",
            "panel.devgarh.in",
            "aarunya.harshitvarshney.in",
            "www.aarunya.harshitvarshney.in"
        ],
        hmr: {
            overlay: false,
        },
        proxy: {
            '/api': {
                target: 'https://aarunya.snxit.me',
                changeOrigin: true,
                secure: true,
            },
        },
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    assetsInclude: ["**/*.glb", "**/*.gltf"],
    build: {
        // Target modern browsers to reduce polyfill overhead
        target: 'es2020',
        chunkSizeWarningLimit: 500,
        // Enable CSS code splitting
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React runtime — loaded on every page
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    // Three.js ecosystem — only loaded on CampusExplorer (huge: ~5MB)
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
                    // Animation libs — loaded on most pages but can be deferred
                    'vendor-animation': ['framer-motion', 'gsap'],
                    // Icon library — large but tree-shaken
                    'vendor-icons': ['lucide-react'],
                    // Utility libraries
                    'vendor-utils': ['clsx', 'tailwind-merge', 'date-fns', 'class-variance-authority'],
                    // Radix UI primitives
                    'vendor-radix': [
                        '@radix-ui/react-tooltip',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-label',
                        '@radix-ui/react-slot',
                    ],
                }
            },
        },
        // Better minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: mode === 'production',
                drop_debugger: true,
            },
        },
    },
}));

