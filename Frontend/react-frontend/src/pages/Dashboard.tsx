
import EventCardList from '../components/EventCardList';
import UserMenu from '../components/UserMenu';
import { useAuth } from '../context/AuthContext';
import type Event from '../Interfaces/Event';

const events: Event[] = [
  {
    id: '1',
    name: 'React Conference',
    location: 'Berlin, Germany',
    date: '2026-04-12',
    imageUrl: 'https://picsum.photos/400/300?1'
  },
  {
    id: '2',
    name: 'Music Festival',
    location: 'Barcelona, Spain',
    date: '2026-06-01',
    imageUrl: 'https://picsum.photos/400/300?2'
  }
];//dummy data


const Dashboard: React.FC = () => {
  const {  loading } = useAuth();
  if (loading) return <div>Loading profile...</div>;

  return (<>
    <div className="container mt-5 text-left">
      <UserMenu/>
    </div>
    <div className="container mt-4 d-flex flex-column align-items-left">
      <EventCardList events={events} />
      </div>
    </>
    
  );
};

export default Dashboard;