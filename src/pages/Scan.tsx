import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';
import { useResponsive } from '@/hooks/use-responsive';
import { Copy, ExternalLink, Zap } from 'lucide-react';

interface ScanResult {
    data: string;
    timestamp: number;
    type: 'url' | 'json' | 'text';
}

const Scan = () => {
    const { isMobile, isTablet } = useResponsive();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [copied, setCopied] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine QR code type
    const getQRType = (data: string): 'url' | 'json' | 'text' => {
        try {
            if (data.startsWith('http://') || data.startsWith('https://')) {
                return 'url';
            }
            if (data.startsWith('{') || data.startsWith('[')) {
                JSON.parse(data);
                return 'json';
            }
        } catch (e) {
            // Not JSON, treat as text
        }
        return 'text';
    };

    // Initialize QR Scanner
    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            try {
                const scanner = new Html5QrcodeScanner(
                    'qr-scanner-container',
                    {
                        fps: 10,
                        qrbox: isMobile ? { width: 250, height: 250 } : { width: 350, height: 350 },
                        disableFlip: false,
                        aspectRatio: 1.0,
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.QR_CODE,
                            Html5QrcodeSupportedFormats.AZTEC,
                            Html5QrcodeSupportedFormats.CODABAR,
                        ],
                    },
                    false
                );

                const success = (decodedText: string) => {
                    const type = getQRType(decodedText);
                    setResult({
                        data: decodedText,
                        timestamp: Date.now(),
                        type,
                    });
                    scanner.pause(true);
                };

                const error = (err: string) => {
                    // Silently handle scanning errors (normal during scanning)
                };

                scanner.render(success, error);
                scannerRef.current = scanner;
            } catch (err: any) {
                if (err.name === 'NotAllowedError') {
                    setPermissionDenied(true);
                    setError('Camera permission was denied. Please enable camera access in your browser settings.');
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found on this device.');
                } else {
                    setError(`Error initializing camera: ${err.message}`);
                }
                setIsScanning(false);
            }
        }

        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.clear().catch(() => {
                    // Ignore errors during cleanup
                });
                scannerRef.current = null;
            }
        };
    }, [isScanning, isMobile]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {
                    // Ignore errors during cleanup
                });
                scannerRef.current = null;
            }
        };
    }, []);

    const handleRescan = () => {
        setResult(null);
        setError(null);
        setPermissionDenied(false);
        if (scannerRef.current) {
            scannerRef.current.resume();
        }
    };

    const handleStartScanning = () => {
        setIsScanning(true);
        setError(null);
        setPermissionDenied(false);
    };

    const handleCopyText = () => {
        if (result) {
            navigator.clipboard.writeText(result.data);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleOpenUrl = () => {
        if (result && result.type === 'url') {
            window.open(result.data, '_blank', 'noopener,noreferrer');
        }
    };

    const renderResult = () => {
        if (!result) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 w-full max-w-2xl mx-auto"
            >
                <div className="relative rounded-lg border-2 border-[#00ffff] bg-gradient-to-b from-[#1a0a2e]/80 to-[#0d0520]/80 p-6 md:p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                    {/* Corner decorations */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#00ffff] rounded-full shadow-[0_0_10px_#00ffff]" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff]" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff]" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#00ffff] rounded-full shadow-[0_0_10px_#00ffff]" />

                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-[#00ff00]" />
                        <h2 className="text-lg md:text-xl font-bold text-[#00ffff] uppercase tracking-wider">
                            QR Code Detected!
                        </h2>
                    </div>

                    <div className="mb-4">
                        <p className="text-[10px] md:text-xs text-[#ff00ff] uppercase tracking-widest mb-2">Type: {result.type}</p>
                        <div className="bg-[#0d0520] border border-[#ff00ff]/30 rounded p-4 min-h-[80px] max-h-[200px] overflow-y-auto">
                            {result.type === 'json' ? (
                                <pre className="text-[#00ff00] text-xs font-mono whitespace-pre-wrap break-words">
                                    {JSON.stringify(JSON.parse(result.data), null, 2)}
                                </pre>
                            ) : (
                                <p className="text-[#00ffff] text-xs md:text-sm font-mono break-words">
                                    {result.data}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {result.type === 'url' && (
                            <Button
                                onClick={handleOpenUrl}
                                className="flex-1 bg-gradient-to-r from-[#00ff00] to-[#00cc00] text-black hover:from-[#00ffff] hover:to-[#00aaff] font-bold uppercase text-xs md:text-sm tracking-wider flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open Link
                            </Button>
                        )}

                        <Button
                            onClick={handleCopyText}
                            className={`flex-1 font-bold uppercase text-xs md:text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${
                                copied
                                    ? 'bg-[#00ff00] text-black'
                                    : 'bg-gradient-to-r from-[#ff00ff] to-[#cc00cc] text-white hover:from-[#ff66ff] hover:to-[#ff00ff]'
                            }`}
                        >
                            <Copy className="w-4 h-4" />
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>

                        <Button
                            onClick={handleRescan}
                            className="flex-1 bg-gradient-to-r from-[#00ffff] to-[#0088ff] text-black hover:from-[#00ff00] hover:to-[#00ccff] font-bold uppercase text-xs md:text-sm tracking-wider"
                        >
                            Rescan
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black overflow-x-hidden">
            <MainNavigation />

            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_70%)]" />
                <div
                    className="absolute inset-0 animate-[pulse_4s_infinite]"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        opacity: 0.05,
                    }}
                />
            </div>

            <div className="content-scale relative z-10">
                {/* HEADER */}
                <div className="relative pt-24 md:pt-32 pb-8 md:pb-12 text-center px-4">
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            <GlitchText text="QR SCANNER" />
                        </h1>

                        <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                        <p className="mt-4 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-2xl mx-auto tracking-[0.2em]">
                            Point your camera at a QR code to scan
                        </p>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 pb-16">
                    {!isScanning && !permissionDenied && !result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <p className="text-[#ff00ff] text-sm md:text-base mb-8 uppercase tracking-wider max-w-md mx-auto leading-relaxed">
                                Ready to scan your pass? Click the button below to begin
                            </p>

                            <Button
                                onClick={handleStartScanning}
                                className="bg-gradient-to-r from-[#ff00ff] to-[#cc00cc] text-white hover:from-[#ff66ff] hover:to-[#ff00ff] font-bold uppercase px-8 py-6 text-sm md:text-base tracking-wider shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                            >
                                Start Scanning
                            </Button>
                        </motion.div>
                    ) : permissionDenied ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="relative rounded-lg border-2 border-[#ff0000] bg-gradient-to-b from-[#2e0000]/80 to-[#0d0520]/80 p-6 md:p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                                <div className="text-center">
                                    <p className="text-[#ff0000] text-lg md:text-xl font-bold mb-4 uppercase tracking-wider">
                                        Camera Permission Denied
                                    </p>
                                    <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
                                        To use the QR scanner, please enable camera permissions in your browser settings.
                                    </p>
                                    <ol className="text-left text-white/60 text-xs md:text-sm space-y-2 mb-6 max-w-md mx-auto">
                                        <li>1. Click the lock icon in your browser's address bar</li>
                                        <li>2. Find "Camera" permissions</li>
                                        <li>3. Change it from "Block" to "Allow"</li>
                                        <li>4. Refresh the page and try again</li>
                                    </ol>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-gradient-to-r from-[#ff0000] to-[#cc0000] text-white hover:from-[#ff3333] hover:to-[#ff0000] font-bold uppercase tracking-wider"
                                    >
                                        Refresh Page
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : isScanning && !result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            {/* QR Scanner Container */}
                            <div className="relative mb-8 bg-[#0d0520] rounded-lg overflow-hidden border-2 border-[#00ffff]/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                                <div
                                    ref={containerRef}
                                    id="qr-scanner-container"
                                    className="w-full"
                                    style={{
                                        minHeight: isMobile ? '350px' : '500px',
                                    }}
                                />

                                {/* Scanning Line Animation */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div
                                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent animate-[slide_2s_linear_infinite]"
                                        style={{
                                            top: '50%',
                                            boxShadow: '0 0 20px #00ff00',
                                        }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded border border-[#ff0000] bg-[#2e0000]/50 text-[#ff0000] text-xs md:text-sm uppercase tracking-wider"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={() => setIsScanning(false)}
                                    className="bg-gradient-to-r from-[#ff0000] to-[#cc0000] text-white hover:from-[#ff3333] hover:to-[#ff0000] font-bold uppercase tracking-wider flex-1 sm:flex-initial"
                                >
                                    Stop Scanning
                                </Button>
                            </div>
                        </motion.div>
                    ) : null}

                    {/* Results Display */}
                    {renderResult()}
                </div>
            </div>

            <style>{`
                @keyframes slide {
                    0% {
                        top: 10%;
                    }
                    50% {
                        top: 90%;
                    }
                    100% {
                        top: 10%;
                    }
                }

                #qr-scanner-container video {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                    transform: scaleX(-1);
                    -webkit-transform: scaleX(-1);
                }

                #qr-scanner-container canvas {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Scan;
