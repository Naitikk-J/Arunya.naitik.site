import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket, MapPin } from 'lucide-react';

export const BottomActions = () => {
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 floating-sticker">
            <div className="glass-card border-kidcore-blue/60 bg-background/85 backdrop-blur-xl rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                    <Link to="/schedule">
                        <Button variant="ghost" size="sm" className="font-orbitron text-xs tracking-wider gap-2 text-kidcore-yellow hover:text-kidcore-orange hover:bg-kidcore-blue/20 rounded-lg">
                            <Calendar size={16} />
                            SCHEDULE
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button size="sm" className="font-orbitron text-xs tracking-wider gap-2 kidcore-btn px-3 py-1 text-sm">
                            <Ticket size={16} />
                            GET PASS
                        </Button>
                    </Link>
                    <Link to="/events">
                        <Button variant="ghost" size="sm" className="font-orbitron text-xs tracking-wider gap-2 text-kidcore-pink hover:text-kidcore-yellow hover:bg-kidcore-pink/20 rounded-lg">
                            <MapPin size={16} />
                            EXPLORE
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
