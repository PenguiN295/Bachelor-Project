import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from "@tanstack/react-query";
import { type EventFilter } from '../Interfaces/EventFilter';
import url from '../../config';
import { useDebounce } from './useDebounce';
import type Event from '../Interfaces/Event';
import { useAuth } from "../context/AuthContext";

const defaultFilters: Partial<EventFilter> = {
    search: '',
    showFull: false,
    price: 0,
    location: ''
};

export const useEvents = (userId?: string, createdByMe?: boolean, communityId?: string, isMember?: boolean, latitude?: number, longitude?: number) => {
    const { token, logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: Partial<EventFilter> = {
        search: searchParams.get('search') || '',
        showFull: searchParams.get('showFull') === 'true',
        price: Number(searchParams.get('price')) || 0,
        location: searchParams.get('location') || '',
        categoryIds: searchParams.getAll('categoryIds'),
        startDate: searchParams.get('startDate') || '',
        latitude: latitude,
        longitude: longitude
    };
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedLocation = useDebounce(filters.location, 500);

    const { 
        data, 
        isLoading, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useInfiniteQuery({
        queryKey: ["events", { ...filters, search: debouncedSearch, location: debouncedLocation, userId, createdByMe, communityId, isMember }],
        queryFn: async ({ pageParam = 1 }): Promise<Event[]> => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(pageParam));
            if (userId) params.set('userId', userId);
            if (createdByMe) params.set('createdByMe', String(createdByMe));
            if (latitude) params.set('latitude', String(latitude));
            if (longitude) params.set('longitude', String(longitude));
            if (communityId) { 
                params.set('communityId', communityId);
                if(isMember) params.set('seePrivate', 'true');
            } else {
                params.set('seePrivate', 'false');
            }

            const response = await fetch(`${url}/events?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
                throw new Error("Fetch failed");
            }
            return await response.json();
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 50 ? allPages.length + 1 : undefined;
        },
        enabled: !!token,
    });

    const events = data?.pages.flat() || [];

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

    return { 
        events, 
        loading: isLoading, 
        filters, 
        handleFilterChange, 
        handleFilterClear, 
        handleCategoryChange,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    };
};