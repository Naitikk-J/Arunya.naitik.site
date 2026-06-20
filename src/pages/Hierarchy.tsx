import { MainNavigation } from '@/components/ui/MainNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Hierarchy = () => {
    const groups = [
        {
            title: 'CORE',
            description: 'Primary coordinators and decision makers.',
            image: '/hierarchy-core.avif',
            members: ['Lead A', 'Lead B', 'Lead C'],
        },
        {
            title: 'OPERATIONS',
            description: 'Logistics, venue, and on-ground execution.',
            image: '/hierarchy-operations.avif',
            members: ['Ops A', 'Ops B', 'Ops C'],
        },
        {
            title: 'CREATIVE',
            description: 'Design, content, and stage production.',
            image: '/hierarchy-creative.avif',
            members: ['Creative A', 'Creative B', 'Creative C'],
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <MainNavigation />

            <div className="relative overflow-hidden bg-gradient-to-b from-kidcore-blue/20 via-kidcore-pink/10 to-transparent py-16">
                <div className="absolute inset-0 scanlines opacity-10" />
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl font-orbitron font-bold text-center mb-4 bg-gradient-to-r from-kidcore-blue via-kidcore-pink to-kidcore-orange bg-clip-text text-transparent animate-rainbow">
                        HIERARCHY
                    </h1>
                    <p className="text-xl text-center text-kidcore-cream font-orbitron max-w-3xl mx-auto">
                        The crew structure behind the festival.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {groups.map((g) => (
                        <Card key={g.title} className="glass-card border-kidcore-blue/60 bg-background/85 backdrop-blur-xl rounded-2xl overflow-hidden group hover:shadow-lg hover:shadow-kidcore-pink/30 transition-all duration-300 floating-sticker">
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={g.image}
                                    alt={`${g.title} team`}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-orbitron text-2xl text-kidcore-yellow">{g.title}</CardTitle>
                                <CardDescription className="font-orbitron text-kidcore-cream">{g.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {g.members.map((m) => (
                                        <Badge key={m} variant="outline" className="font-mono text-xs text-kidcore-green border-kidcore-green/50">
                                            {m}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-6 left-6 w-20 h-0.5 bg-gradient-to-r from-kidcore-blue to-transparent" />
            <div className="fixed bottom-6 left-6 w-0.5 h-20 bg-gradient-to-t from-kidcore-blue to-transparent" />
            <div className="fixed bottom-6 right-6 w-20 h-0.5 bg-gradient-to-l from-kidcore-pink to-transparent" />
            <div className="fixed bottom-6 right-6 w-0.5 h-20 bg-gradient-to-t from-kidcore-pink to-transparent" />
        </div>
    );
};

export default Hierarchy;
