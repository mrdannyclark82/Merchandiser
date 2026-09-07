export interface ResetPhoto {
  id: string;
  url: string;
  timestamp: string;
  note?: string;
  taskId?: string;
}

export interface ResetDoc {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  url: string;
  uploadedAt: string;
}

export interface ResetTask {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
  photoIds?: string[];
}

export interface ResetProject {
  id: string;
  storeName: string;
  name: string;
  location: string; // e.g., 'Aisle 12 Front'
  address?: string;
  lat: number;
  lng: number;
  geofenceRadiusMeters: number; // default 300m
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  tasks: ResetTask[];
  photos: ResetPhoto[];
  documents: ResetDoc[];
  notes?: string;
}

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

