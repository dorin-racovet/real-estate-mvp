import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const thumbnail = property.images && property.images.length > 0 
    ? `http://localhost:8000/${property.images[0]}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold shadow-sm">
          {formattedPrice}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <MapPin size={16} className="mr-1" />
          <span className="truncate">{property.city}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-50">
           <div className="flex items-center justify-center text-gray-600 text-sm">
               <Square size={16} className="mr-2 text-indigo-400" />
               <span>{property.surface}m²</span>
           </div>
           {property.bedrooms !== undefined && (
               <div className="flex items-center justify-center text-gray-600 text-sm">
                   <Bed size={16} className="mr-2 text-indigo-400" />
                   <span>{property.bedrooms}</span>
               </div>
           )}
           {property.bathrooms !== undefined && (
               <div className="flex items-center justify-center text-gray-600 text-sm">
                   <Bath size={16} className="mr-2 text-indigo-400" />
                   <span>{property.bathrooms}</span>
               </div>
           )}
        </div>

        <div className="mt-4">
          <Link 
            to={`/properties/${property.id}`}
            className="block w-full text-center bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-semibold py-3 rounded-lg transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
