import { MainNavigation } from '@/components/ui/MainNavigation';
import { Badge } from '@/components/ui/badge';

const historyNodes = [
  {
    year: '2025',
    title: 'BETA_PHASE_LAUNCH',
    status: 'COMPLETED',
    log: 'Initial system deployment. 10k players joined the network.'
  },
  {
    year: '2024',
    title: 'THE_NEON_UPGRADE',
    status: 'COMPLETED',
    log: 'Major visual overhaul. High-density pixel shaders implemented.'
  },
  {
    year: '2023',
    title: 'INFRASTRUCTURE_GENESIS',
    status: 'COMPLETED',
    log: 'Foundation layer established. First node cluster activated.'
  }
];

const History = () => {
  return (
    <div className="min-h-screen bg-black text-white font-pixel selection:bg-electric-yellow selection:text-black">
      <MainNavigation />

      {/* Header */}
      <div className="relative pt-32 pb-16 overflow-hidden border-b-4 border-electric-yellow/20">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl text-electric-yellow mb-4 glow-yellow uppercase tracking-tighter">
            ARCHIVE_LOGS
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.3em] max-w-2xl mx-auto">
            Recovered data from previous cycles.
          </p>
        </div>
      </div>

      {/* History Timeline */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {historyNodes.map((node, idx) => (
            <div key={node.year} className="relative group flex flex-col md:flex-row gap-8 items-start">
              {/* Year Hex */}
              <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center border-4 border-electric-yellow bg-electric-yellow/10 relative">
                <div className="absolute inset-1 border-2 border-dashed border-electric-yellow/40" />
                <span className="text-xl text-electric-yellow font-bold tracking-tighter">{node.year}</span>
              </div>

              {/* Data Block */}
              <div className="flex-1 p-6 border-4 border-white/10 bg-white/5 relative overflow-hidden group-hover:border-electric-yellow/40 transition-colors">
                <div className="absolute top-0 right-0 p-2 bg-white/10 text-[8px] uppercase tracking-widest text-muted-foreground">
                  NODE_{node.status}
                </div>
                
                <h3 className="text-xl text-white mb-4 tracking-tight uppercase group-hover:text-electric-yellow transition-colors">
                  {node.title}
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-black/40 border-l-4 border-electric-yellow">
                    <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-mono">
                      {node.log}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-1 flex-1 bg-white/5 relative">
                      <div className="absolute inset-0 bg-electric-yellow w-full" />
                    </div>
                    <span className="text-[8px] text-electric-yellow/60 uppercase">System Integrity: 100%</span>
                  </div>
                </div>
              </div>

              {/* Vertical line between nodes */}
              {idx !== historyNodes.length - 1 && (
                <div className="hidden md:block absolute left-12 top-24 bottom-[-64px] w-1 bg-gradient-to-b from-electric-yellow/40 to-transparent z-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer status */}
      <div className="py-20 text-center">
        <p className="text-[10px] text-muted-foreground uppercase animate-pulse">
          End of history stream. Continuing to current session...
        </p>
      </div>
    </div>
  );
};

export default History;
