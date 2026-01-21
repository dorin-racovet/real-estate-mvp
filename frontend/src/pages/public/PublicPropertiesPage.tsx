import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types/property';
import { propertiesApi } from '../../api/properties';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Search, UserCircle, ChevronLeft, ChevronRight, Heart, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';

export const PublicPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [hasMore, setHasMore] = useState(true);

  // Fetch all cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await propertiesApi.getPublished(undefined, undefined, 0, 1000);
        const uniqueCities = Array.from(new Set(data.map(p => p.city))).sort();
        setAllCities(uniqueCities);
      } catch (err) {
        console.error('Failed to fetch cities', err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const skip = (page - 1) * PAGE_SIZE;
        // Pass cityFilter and sortBy to API
        const data = await propertiesApi.getPublished(cityFilter || undefined, sortBy || undefined, skip, PAGE_SIZE);
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
  }, [page, cityFilter, sortBy]);

  // Client-side search only filters by title now since city is handled by server
  const filteredProperties = properties.filter(prop => 
    searchTerm === '' || prop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero / Header */}
      <div className="bg-indigo-900 dark:bg-indigo-950 text-white py-16 relative transition-colors duration-200">
        <div className="absolute top-4 right-6 flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all border-2 ${
                theme === 'light' 
                  ? 'bg-gray-900 hover:bg-gray-800 border-gray-700' 
                  : 'bg-white hover:bg-gray-100 border-gray-300'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-white" />
              ) : (
                <Sun size={20} className="text-gray-900" />
              )}
            </button>
            
            <Link to="/favorites" className="flex items-center space-x-2 bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg transition border border-indigo-700">
                <Heart size={20} fill={favorites.length > 0 ? "currentColor" : "none"} className={favorites.length > 0 ? "text-red-400" : ""} />
                <span>Favorites ({favorites.length})</span>
            </Link>

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
          
          <div className="max-w-2xl mx-auto relative mb-8">
            <input
              type="text"
              placeholder="Search by property name..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl border-2 border-white/20 bg-white/95 backdrop-blur-sm transition-all hover:shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={22} />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <select 
                data-testid="filter-city"
                value={cityFilter}
                onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                className="w-full px-5 py-3.5 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-white/50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-white/20 cursor-pointer transition-all hover:shadow-xl appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="">📍 All Cities</option>
                {allCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative">
              <select 
                data-testid="sort-by"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-5 py-3.5 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-white/50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-white/20 cursor-pointer transition-all hover:shadow-xl appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="">🕐 Newest Listed</option>
                <option value="price_asc">💰 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 py-10">{error}</div>
        ) : (
          <>
             
             <div className="mb-8 flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
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
               <div className="text-center py-20 text-gray-500 dark:text-gray-400">
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
