import { useSearchParams } from 'react-router-dom';
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

export const useEvents = (userId?: string, createdByMe?: boolean) => {
    const { token, logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: EventFilter = {
        page: Number(searchParams.get('page')) || defaultFilters.page,
        search: searchParams.get('search') || '',
        showFull: searchParams.get('showFull') === 'true',
        price: Number(searchParams.get('price')) || 0,
        location: searchParams.get('location') || '',
        categoryIds: searchParams.getAll('categoryIds'),
        startDate: searchParams.get('startDate') || '',
    };
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedLocation = useDebounce(filters.location, 500);

    const { data: events = [], isLoading } = useQuery({
        queryKey: ["events", { ...filters, search: debouncedSearch, location: debouncedLocation, userId, createdByMe }],
        queryFn: async (): Promise<Event[]> => {
            const response = await fetch(`${url}/events?${searchParams.toString()}${userId ? `&userId=${userId}` : ''}${createdByMe ? `&createdByMe=${createdByMe}` : ''}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
                throw new Error("Fetch failed");
            }
            return response.json();
        },
        enabled: !!token,
    });
    const updateUrl = (newParams: Partial<EventFilter>) => {
        const params = new URLSearchParams(searchParams);
        
        Object.entries(newParams).forEach(([key, value]) => {
            params.delete(key);
            if (value !== undefined && value !== null && value !== '' && value !== false && value !== 0) {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else {
                    params.set(key, String(value));
                }
            }
        });
        if (!newParams.hasOwnProperty('page')) params.set('page', '1');
        
        setSearchParams(params, { replace: true });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        updateUrl({ [name]: finalValue });
    };

    const handleCategoryChange = (values: string[]) => {
        updateUrl({ categoryIds: values });
    };

    const handleFilterClear = () => setSearchParams({});

    return { events, loading: isLoading, filters, handleFilterChange, handleFilterClear, handleCategoryChange };
};