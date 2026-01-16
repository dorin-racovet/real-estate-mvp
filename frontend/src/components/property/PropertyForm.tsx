import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUploader } from './ImageUploader';
import { propertiesApi } from '../../api/properties';
import { Property, PropertyCreate } from '../../types/property';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface PropertyFormProps {
  initialData?: Property;
  onSuccess?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState<PropertyCreate>({
    title: '',
    price: 0,
    surface: 0,
    city: '',
    street: '',
    address: '',
    property_type: 'apartment',
    bedrooms: 0,
    bathrooms: 0,
  });
  const [description, setDescription] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        price: initialData.price,
        surface: initialData.surface,
        city: initialData.city,
        street: initialData.street || '',
        address: initialData.address || '',
        property_type: initialData.property_type,
        bedrooms: initialData.bedrooms || 0,
        bathrooms: initialData.bathrooms || 0,
      });
      setDescription(initialData.description || '');
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'description') {
        setDescription(value);
    } else {
        setFormData((prev) => ({
          ...prev,
          [name]: name === 'price' || name === 'surface' || name === 'bedrooms' || name === 'bathrooms' 
            ? Number(value) 
            : value,
        }));
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (files.length === 0 && existingImages.length === 0) {
        setError('At least one image is required.');
        setLoading(false);
        return;
    }

    try {
      const propertyData = { ...formData, description };
      
      let property;
      if (initialData) {
         property = await propertiesApi.update(initialData.id, {
             ...propertyData,
             images: existingImages
         });
      } else {
         property = await propertiesApi.create(propertyData);
      }
      
      if (files.length > 0) {
        await propertiesApi.uploadImages(property.id, files);
      }
      
      setSuccess(true);
      
      if (!initialData) {
        setFormData({
            title: '',
            price: 0,
            surface: 0,
            city: '',
            street: '',
            address: '',
            property_type: 'apartment',
            bedrooms: 0,
            bathrooms: 0,
        });
        setDescription('');
        setFiles([]);
      }

      if (onSuccess) {
          onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Property' : 'Add New Property'}</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center mb-4">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center mb-4">
            <CheckCircle className="mr-2" size={20} />
            {initialData ? 'Property updated successfully!' : 'Property created successfully!'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Modern Apartment in City Center" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
          <Input name="price" type="number" value={formData.price} onChange={handleChange} required min="0" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <Input name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
          <Input name="surface" type="number" value={formData.surface} onChange={handleChange} required min="0" />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
           <select 
             name="property_type" 
             value={formData.property_type} 
             onChange={handleChange}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="apartment">Apartment</option>
             <option value="house">House</option>
             <option value="condo">Condo</option>
             <option value="land">Land</option>
             <option value="commercial">Commercial</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <Input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <Input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} min="0" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          name="description" 
          value={description} 
          onChange={handleChange} 
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images <span className="text-red-500">*</span></label>
        
        {existingImages.length > 0 && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                        <img 
                            src={img.startsWith('http') ? img : `http://localhost:8000/${img}`} 
                            alt={`Existing ${index}`} 
                            className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        )}

        <ImageUploader 
          onFilesSelected={handleFilesSelected}
          selectedFiles={files}
          onRemoveFile={handleRemoveFile}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={loading}>
          {initialData ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
};
