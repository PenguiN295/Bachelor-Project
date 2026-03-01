import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { type EventFilter } from '../Interfaces/EventFilter';
import url from '../../config';
import { useDebounce } from './useDebounce';
import type Event from '../Interfaces/Event';
import { useAuth } from "../context/AuthContext";

const defaultFilters: EventFilter = {
    page: 1,
    search: '',
    showFull: false,
    price: 0,
    location: ''
};

export const useEvents = (initialFilters: Partial<EventFilter> = {}) => {
    const { token } = useAuth();
    const [filters, setFilters] = useState<EventFilter>({
        ...defaultFilters,
        ...initialFilters
    });
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedLocation = useDebounce(filters.location, 500);

    const { data: events = [], isLoading } = useQuery({
        queryKey: ["events", { ...filters, search: debouncedSearch, location: debouncedLocation }],
        queryFn: async (): Promise<Event[]> => {
            const queryParams = new URLSearchParams();
            Object.entries({ ...filters, search: debouncedSearch, location: debouncedLocation }).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${url}/events?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch events");
            return response.json();
        },
        enabled: !!token,
    });

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

    const handleFilterClear = () => setFilters(defaultFilters);

    return { 
        events, 
        loading: isLoading, 
        filters, 
        handleFilterChange, 
        handleFilterClear 
    };
};