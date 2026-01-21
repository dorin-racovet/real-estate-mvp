import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import api from '../lib/axios';
import { Property } from '../types/property';

export const AdminPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="dark:text-gray-100">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">All Properties</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{property.title}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">${property.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{property.city}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                       property.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                   }`}>
                    {property.status}
                  </span>
                </td>
                 <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                  {property.agent ? property.agent.name : 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/properties/${property.id}/edit`)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
             {properties.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No properties found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
