import { MainNavigation } from '@/components/ui/MainNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Merch = () => {
    const items = [
        {
            name: 'NEON TEE',
            desc: 'Festival tee with glow-styled print.',
            image: '/merch-neon-tee.avif',
            tags: ['S-XXL', 'LIMITED'],
        },
        {
            name: 'HOLOGRAPHIC STICKERS',
            desc: 'Shimmer pack for laptops and bottles.',
            image: '/merch-stickers.avif',
            tags: ['PACK', 'SHINE'],
        },
        {
            name: 'WRISTBAND',
            desc: 'Access band with cyber pattern.',
            image: '/merch-wristband.avif',
            tags: ['PASS', 'EASY'],
        },
    ];

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black">
            <MainNavigation />

            {/* Header */}
            <div className="relative pt-40 pb-20 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.1)_0%,transparent_70%)] pointer-events-none" />
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6 uppercase">
                    MERCH
                </h1>
                <div className="h-1 w-[120px] bg-primary mx-auto shadow-neon mb-8" />
                <p className="mt-8 text-sm md:text-base font-share-tech text-muted-foreground tracking-[0.4em] uppercase opacity-60 max-w-3xl mx-auto px-6">
                    // PICK YOUR GEAR. KEEP THE GLOW. LIMITED EDITION ARTIFACTS.
                </p>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
                    {items.map((item) => (
                        <div key={item.name} className="group">
                            <div className="relative h-full bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5 rounded-xl overflow-hidden hover:border-primary shadow-[0_0_30px_rgba(188,19,254,0.05)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(188,19,254,0.15)] flex flex-col">
                                <div className="h-64 relative overflow-hidden flex items-center justify-center border-b border-white/5 bg-black/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-700" />
                                    <img
                                        src={item.image}
                                        alt={`${item.name} merch`}
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0221] via-transparent to-transparent opacity-60" />

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {item.tags.map((t) => (
                                            <Badge key={t} className="bg-primary/20 text-primary border border-primary/30 font-share-tech text-[8px] tracking-widest rounded-none px-3 py-1 backdrop-blur-md">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors mb-2 tracking-tight uppercase">
                                        {item.name}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                        {item.desc}
                                    </p>

                                    <div className="mt-auto">
                                        <Button
                                            className="w-full font-orbitron text-[10px] tracking-[0.3em] font-bold py-6 rounded-none border-2 border-primary bg-primary text-black hover:bg-transparent hover:text-primary transition-all shadow-neon uppercase"
                                        >
                                            ACQUIRE ITEM
                                        </Button>
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />
        </div>
    );
};

export default Merch;
