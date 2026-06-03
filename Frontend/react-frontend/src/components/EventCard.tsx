import React from 'react';
import { useNavigate } from 'react-router-dom';
import type Event from '../Interfaces/Event';
import noPhoto from '../assets/nophoto.svg';
import { formatDate } from '../utils/dateUtils';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const navigate = useNavigate();
    
    const handleEventPress = () => {
        if (event.slug) navigate(`/event/${event.slug}`);
    };

    return (
        <Card 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-md h-full flex flex-col group border-slate-200"
            onClick={handleEventPress}
        >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                    src={event.imageUrl || noPhoto} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                    <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                        {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                    </span>
                </div>
            </div>
            
            <CardContent className="flex-1 p-5 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>
                
                <div className="space-y-2 mt-auto">
                    <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                        <span className="truncate">{event.city}, {event.county}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-primary shrink-0" />
                        <span className="truncate">{formatDate(event.startAt)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                        <Users className="w-4 h-4 mr-2 text-primary shrink-0" />
                        <span>{event.currentAttendees} / {event.maxAttendees} attending</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventCard;