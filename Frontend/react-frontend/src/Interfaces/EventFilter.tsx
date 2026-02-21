
export interface EventFilter{
  search?: string;
  startDate?: string;
  maxAttendees?: number; 
  price?: number;
  location?: string;
  showFull?: boolean;
  page: number;
}