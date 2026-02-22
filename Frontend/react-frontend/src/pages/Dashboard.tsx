
import UserMenu from '../components/UserMenu';
import React from 'react'
import EventCardList from '../components/EventCardList'
import { useEvents } from '../hooks/useEvents'
import LoadingState from '../components/LoadingState';
import FilterComponent from '../components/FilterComponent';





const Dashboard: React.FC = () => {

  const { events, loading, filters, handleFilterChange, handleFilterClear } = useEvents();
  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-12">
          <UserMenu />
        </div>
      </div>

      <div className="row">

        <aside className="col-md-3 mb-4">
          <div className="sticky-top" style={{ top: '20px' }}>
            <h5 className="mb-3">Filters</h5>
            <FilterComponent
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleFilterClear={handleFilterClear}
            />
          </div>
        </aside>

        <main className="col-md-9">
          {loading ? (
            <LoadingState />
          ) : events.length > 0 ? (
            <EventCardList events={events} />
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

