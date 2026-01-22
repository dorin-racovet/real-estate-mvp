import React from 'react';
import { Property } from '../../types/property';
import { Button } from '../ui/Button';

interface PropertyTableProps {
  properties: Property[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onEdit: (id: number) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ 
  properties, 
  isLoading, 
  onDelete, 
  onToggleStatus, 
  onEdit 
}) => {
  if (isLoading) {
    return <div className="text-center py-4 dark:text-gray-300">Loading properties...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No properties found. Create your first one!</p>
      </div>
    );
  }

  // Helper to resolve image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Thumbnail</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Title</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Price</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">City</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {properties.map((property) => (
            <tr key={property.id} data-testid={`property-row-${property.id}`}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                        <img 
                          src={getImageUrl(property.images[0])} 
                          alt={property.title} 
                          className="h-full w-full object-cover" 
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{property.title}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">${property.price.toLocaleString()}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{property.city}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  property.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                }`} data-testid={`property-status-${property.id}`}>
                  {property.status}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => onEdit(property.id)} 
                  className="text-xs px-2 py-1"
                  data-testid={`edit-property-${property.id}`}
                >
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => onToggleStatus(property.id)} 
                  className="text-xs px-2 py-1"
                  data-testid={`toggle-status-property-${property.id}`}
                >
                    {property.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => onDelete(property.id)} 
                  className="text-xs px-2 py-1"
                  data-testid={`delete-property-${property.id}`}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
