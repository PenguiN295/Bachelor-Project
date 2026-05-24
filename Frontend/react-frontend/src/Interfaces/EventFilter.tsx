
export interface EventFilter{
  search?: string;
  startDate?: string;
  price?: number;
  location?: string;
  showFull?: boolean;
  page?: number;
  latitude?: number;
  longitude?: number;
  createdByMe? : boolean;
  userId? : string;
  categoryIds? : string[];
  seePrivate? : boolean;
}