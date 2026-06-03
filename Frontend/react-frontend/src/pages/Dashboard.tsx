import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import EventCardList from '../components/EventCardList'
import { useEvents } from '../hooks/useEvents'
import LoadingState from '../components/LoadingState';
import FilterComponent from '../components/FilterComponent';
import { CreateEventButton } from '../components/CreateEventButton';
import { useCategories } from '../hooks/useCategories';
import { getUserLocation } from '../utils/locationUtils';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
      }
      setLocationLoading(false);
    };
    fetchLocation();
  }, []);

  const { 
    events, 
    loading, 
    filters, 
    handleFilterChange, 
    handleFilterClear, 
    handleCategoryChange,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useEvents(
    undefined, undefined, undefined, undefined, 
    userLocation?.latitude, userLocation?.longitude
  );
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { categories } = useCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="sticky top-24">
            <FilterComponent
              filters={filters}
              categories={categories || []}
              handleFilterChange={handleFilterChange}
              handleFilterClear={handleFilterClear}
              handleCategoryChange={handleCategoryChange}
            />
            <div className="mt-4">
              <CreateEventButton/>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Explore Events</h1>
            <p className="text-slate-500 mt-1">Discover what's happening around you.</p>
          </div>

          {(loading || locationLoading) ? (
            <LoadingState />
          ) : events.length > 0 ? (
            <>
              <EventCardList events={events} />
              
              <div ref={ref} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i className="bi bi-search text-slate-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No events found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Dashboard;