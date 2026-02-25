import { useState, useEffect } from 'react';
import { type EventFilter } from '../Interfaces/EventFilter'
import url from '../../config';
import { useDebounce } from './useDebounce';
import type Event from '../Interfaces/Event';


const defaultFilters: EventFilter = {
        page: 1,
        search: '',
        showFull: false,
        price: 0, 
        location: ''
};
export const useEvents = (initialFilters: Partial<EventFilter> = {}) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [filters, setFilters] = useState<EventFilter>({
        ...defaultFilters,
        ...initialFilters
    });
    
    const debouncedFilters = useDebounce(filters, 500);
    

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const queryParams = new URLSearchParams();

                Object.entries(debouncedFilters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });

                const response = await fetch(`${url}/events?${queryParams}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [debouncedFilters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value;

        setFilters(prev => ({
            ...prev,
            [name]: finalValue,
            page: 1
        }));
    };
    const handleFilterClear = () =>
    {
        setFilters(defaultFilters)
    }


    return { events, loading, filters, setFilters, handleFilterChange, handleFilterClear };
};