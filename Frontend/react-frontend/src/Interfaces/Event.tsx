export default interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  latitude: number;
  longitude: number;
  city: string;
  slug: string;
  county: string;
  imageUrl: string;
}