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

      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Your Trusted Real Estate Partner
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We specialize in connecting buyers with their perfect properties. With years of experience in the real estate market, 
              our team of professional agents is dedicated to making your property search seamless and successful. Whether you're 
              looking for your first home, an investment property, or your dream estate, we're here to guide you every step of the way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Properties Listed</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">1,200+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Clients</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">15+</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Investment Opportunities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover lucrative real estate investment opportunities across different property types and locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Residential</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Single-family homes perfect for families and long-term investments with steady appreciation.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Commercial</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                High-yield commercial properties in prime locations with excellent rental income potential.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🏘️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Condos</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Modern condominiums with amenities, ideal for urban living and rental investments.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🌳</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Land</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Development-ready land parcels in growing areas with high appreciation potential.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Ranges Section */}
      <div className="bg-indigo-900 dark:bg-indigo-950 text-white py-16 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Properties For Every Budget
            </h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              From starter homes to luxury estates, we have options that fit your budget and lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition">
              <div className="text-indigo-200 font-semibold mb-2">Starter Homes</div>
              <div className="text-3xl font-bold mb-4">$150K - $350K</div>
              <ul className="space-y-2 text-indigo-100">
                <li>✓ 1-2 Bedrooms</li>
                <li>✓ Perfect for first-time buyers</li>
                <li>✓ Growing neighborhoods</li>
                <li>✓ Great investment potential</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border-2 border-yellow-400 hover:bg-white/15 transition relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <div className="text-indigo-200 font-semibold mb-2">Family Homes</div>
              <div className="text-3xl font-bold mb-4">$350K - $750K</div>
              <ul className="space-y-2 text-indigo-100">
                <li>✓ 3-4 Bedrooms</li>
                <li>✓ Spacious living areas</li>
                <li>✓ Top-rated school districts</li>
                <li>✓ Modern amenities included</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition">
              <div className="text-indigo-200 font-semibold mb-2">Luxury Estates</div>
              <div className="text-3xl font-bold mb-4">$750K+</div>
              <ul className="space-y-2 text-indigo-100">
                <li>✓ 4+ Bedrooms</li>
                <li>✓ Premium locations</li>
                <li>✓ High-end finishes</li>
                <li>✓ Exclusive communities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">RealEstate Pro</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner in finding the perfect property. Professional service, premium listings.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition">Browse Properties</a></li>
                <li><Link to="/favorites" className="hover:text-indigo-400 transition">My Favorites</Link></li>
                <li><Link to="/login" className="hover:text-indigo-400 transition">Agent Login</Link></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Property Types</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition">Apartments</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Houses</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Condos</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Commercial</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:info@realestate.pro" className="hover:text-indigo-400 transition">info@realestate.pro</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>123 Real Estate St, City</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 RealEstate Pro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
