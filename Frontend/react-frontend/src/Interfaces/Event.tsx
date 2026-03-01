export default interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  location: string;
  imageUrl: string;
}