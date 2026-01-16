export interface PropertyAgent {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  surface: number;
  city: string;
  street?: string;
  address?: string;
  property_type: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  status: 'draft' | 'published';
  images: string[];
  agent_id: number;
  agent: PropertyAgent;
  created_at: string;
  updated_at: string;
}

export interface PropertyCreate {
  title: string;
  description?: string;
  price: number;
  surface: number;
  city: string;
  street?: string;
  address?: string;
  property_type: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyUpdate extends Partial<PropertyCreate> {
  status?: 'draft' | 'published';
  images?: string[];
}
