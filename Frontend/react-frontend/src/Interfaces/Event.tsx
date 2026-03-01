export default interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string,
  endTime: string,
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  location: string;
  imageUrl: string;
}