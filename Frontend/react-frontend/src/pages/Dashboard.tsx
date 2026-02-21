
import UserMenu from '../components/UserMenu';
import React from 'react'
import url from '../../config';
import EventCardList from '../components/EventCardList'
import { type EventFilter } from '../Interfaces/EventFilter'
import { useState, useEffect } from 'react'

// const events: Event[] = [
//   {
//     id: '1',
//     name: 'React Conference',
//     location: 'Berlin, Germany',
//     date: '2026-04-12',
//     imageUrl: 'https://picsum.photos/400/300?1'
//   },
//   {
//     id: '2',
//     name: 'Music Festival',
//     location: 'Barcelona, Spain',
//     date: '2026-06-01',
//     imageUrl: ''
//   }
// ];//dummy data





const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState<EventFilter>({
    page: 1,
    search: '',
    showFull: true 
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
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
  }, [filters]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };
  return (<>
  <div className="filter-bar">
        <input 
          type="text" 
          placeholder="Search events..." 
          value={filters.search} 
          onChange={handleSearchChange} 
        />
      </div>
    <div className="container mt-5 text-left">
      <UserMenu />
    </div>
    <div className="container mt-4 d-flex flex-column align-items-left">
      <EventCardList events={events} />
    </div>
  </>

  );
};

export default Dashboard;

