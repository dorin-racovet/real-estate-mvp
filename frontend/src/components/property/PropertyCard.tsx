import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(property.id);

  const toggleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isFav) removeFavorite(property.id);
      else addFavorite(property.id);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const thumbnail = property.images && property.images.length > 0 
    ? `http://localhost:8000/${property.images[0]}`
    : null;

  return (
    <Link 
      to={`/properties/${property.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group block cursor-pointer" 
      data-testid="property-card"
    >
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            data-testid="property-image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        <button 
          onClick={toggleFavorite}
          className={`absolute top-4 left-4 p-2 rounded-full cursor-pointer transition shadow-sm ${
            isFav ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'
          }`}
          data-testid="toggle-favorite"
        >
          <Heart size={20} fill={isFav ? "currentColor" : "none"} />
        </button>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold shadow-sm" data-testid="property-price">
          {formattedPrice}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 truncate" data-testid="property-title">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4 text-sm">
          <MapPin size={16} className="mr-1" />
          <span className="truncate">{property.city}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-50 dark:border-gray-700">
           <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
               <Square size={16} className="mr-2 text-indigo-400" />
               <span>{property.surface}m²</span>
           </div>
           {property.bedrooms !== undefined && (
               <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                   <Bed size={16} className="mr-2 text-indigo-400" />
                   <span>{property.bedrooms}</span>
               </div>
           )}
           {property.bathrooms !== undefined && (
               <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                   <Bath size={16} className="mr-2 text-indigo-400" />
                   <span>{property.bathrooms}</span>
               </div>
           )}
        </div>
      </div>
    </Link>
  );
};
