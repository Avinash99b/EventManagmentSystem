export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  starts_at: string; // ISO string
  location: string;
  capacity: number;
}

export interface Registration {
  event_id: string;
  user_id: string;
  registered_at?: string;
}
