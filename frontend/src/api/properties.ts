import api from '../lib/axios';
import { Property, PropertyCreate, PropertyUpdate } from '../types/property';

export const propertiesApi = {
  create: async (data: PropertyCreate): Promise<Property> => {
    const response = await api.post<Property>('/properties', data);
    return response.data;
  },

  uploadImages: async (propertyId: number, files: File[]): Promise<Property> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<Property>(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyProperties: async (skip = 0, limit = 100): Promise<Property[]> => {
    const response = await api.get<Property[]>('/properties/mine', {
      params: { skip, limit }
    });
    return response.data;
  },

  getPublished: async (city?: string, sort?: string, skip = 0, limit = 100): Promise<Property[]> => {
    const response = await api.get<Property[]>('/properties/published', {
      params: { city, sort, skip, limit }
    });
    return response.data;
  },

  getProperty: async (id: number): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  update: async (id: number, data: PropertyUpdate): Promise<Property> => {
    const response = await api.patch<Property>(`/properties/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};


