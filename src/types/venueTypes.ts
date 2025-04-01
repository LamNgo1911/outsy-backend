// Venue related types
export interface Venue {
  id: string;
  name: string;
  address: string;
  state: string | null;
  postalCode: string;
  city: string;
  country: string;
  description: string | null;
  imageUrl: string | null;

  // Relations
  events?: Event[];
}

export interface VenueInput {
  name: string;
  address: string;
  state?: string;
  postalCode: string;
  city: string;
  country: string;
  description?: string;
  imageUrl?: string;
}