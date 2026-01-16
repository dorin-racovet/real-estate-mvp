import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { propertiesApi } from '../../api/properties';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Search, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const skip = (page - 1) * PAGE_SIZE;
        const data = await propertiesApi.getPublished(skip, PAGE_SIZE);
        setProperties(data);
        setHasMore(data.length === PAGE_SIZE);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [page]);

  const filteredProperties = properties.filter(prop => 
    prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Header */}
      <div className="bg-indigo-900 text-white py-16 relative">
        <div className="absolute top-4 right-6">
            {user ? (
                <Link to="/dashboard" className="flex items-center space-x-2 bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg transition border border-indigo-700">
                    <UserCircle size={20} />
                    <span>Dashboard</span>
                </Link>
            ) : (
                <Link to="/login" className="flex items-center space-x-2 bg-white text-indigo-900 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50 transition">
                    <UserCircle size={20} />
                    <span>Agent Login</span>
                </Link>
            )}
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            Browse our exclusive collection of premium properties available for sale.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by city, address, or name..."
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <>
             
             <div className="mb-8 flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-800">
                 {filteredProperties.length} Properties Found
               </h2>
               {/* Could add sort dropdown here */}
             </div>
             
             {filteredProperties.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredProperties.map((property) => (
                   <PropertyCard key={property.id} property={property} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 text-gray-500">
                 No properties found matching your criteria.
               </div>
             )}

             <div className="mt-12 flex justify-center items-center space-x-4">
               <button
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
                 className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
               >
                 <ChevronLeft size={24} />
               </button>
               <span className="text-gray-600 font-medium text-lg">Page {page}</span>
               <button
                 onClick={() => setPage(p => p + 1)}
                 disabled={!hasMore}
                 className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
               >
                 <ChevronRight size={24} />
               </button>
             </div>
          </>
        )}
      </div>
    </div>
  );
};
