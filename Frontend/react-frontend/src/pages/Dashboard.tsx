
import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import EventCardList from '../components/EventCardList'
import { useEvents } from '../hooks/useEvents'
import LoadingState from '../components/LoadingState';
import FilterComponent from '../components/FilterComponent';
import { CreateEventButton } from '../components/CreateEventButton';
import { useCategories } from '../hooks/useCategories';
import { getUserLocation } from '../utils/locationUtils';


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
    <div className="container mt-5">
      <div className="row">
        <aside className="col-md-3 mb-4">
          <div className="sticky-top" style={{ top: '20px' }}>
            <h5 className="mb-3">Filters</h5>
            <FilterComponent
              filters={filters}
              categories={categories}
              handleFilterChange={handleFilterChange}
              handleFilterClear={handleFilterClear}
              handleCategoryChange={handleCategoryChange}
            />
            <CreateEventButton/>
          </div>
        </aside>

        <main className="col-md-9">
          {(loading || locationLoading) ? (
            <LoadingState />
          ) : events.length > 0 ? (
            <>
              <EventCardList events={events} />
              
              <div ref={ref} className="py-4 text-center">
                {isFetchingNextPage && (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading more...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card p-5 text-center shadow-sm">
              <p className="text-muted mb-0">No events found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

