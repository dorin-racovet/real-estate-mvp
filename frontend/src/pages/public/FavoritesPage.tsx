import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "../../types/property";
import { propertiesApi } from "../../api/properties";
import { PropertyCard } from "../../components/property/PropertyCard";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { UserCircle, Heart, Moon, Sun } from "lucide-react";

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setProperties([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch properties in parallel
        // Ideally we would have a specific endpoint, but calling by ID works for MVP
        const promises = favorites.map(id => propertiesApi.getProperty(id).catch(() => null));
        const results = await Promise.all(promises);
        // Filter out nulls (deleted properties etc)
        setProperties(results.filter((p): p is Property => p !== null));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
       <div className="bg-indigo-900 dark:bg-indigo-950 text-white py-12 relative transition-colors duration-200">
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
            
            <Link to="/" className="flex items-center space-x-2 bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg transition border border-indigo-700">
                <span>Browse All</span>
            </Link>
            {user ? (
                <Link to="/dashboard" className="flex items-center space-x-2 bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg transition border border-indigo-700">
                    <UserCircle size={20} />
                    <span>Dashboard</span>
                </Link>
            ) : (
                <Link to="/login" className="flex items-center space-x-2 bg-white text-indigo-900 px-4 py-2 rounded-lg font-bold">
                    <UserCircle size={20} />
                    <span>Login</span>
                </Link>
            )}
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center mb-4">
                <Heart size={40} className="text-red-400 mr-3" fill="currentColor" />
                <h1 className="text-4xl font-bold">My Favorites</h1>
            </div>
            <p className="text-indigo-200">Your saved dream homes</p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-12">
         {isLoading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div></div>
         ) : properties.length === 0 ? (
           <div className="text-center py-20 text-gray-500 dark:text-gray-400">
             <h2 className="text-2xl font-semibold mb-4 dark:text-gray-300">No favorites yet</h2>
             <p className="mb-8">Start exploring and save properties you love!</p>
             <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition">
               Browse Properties
             </Link>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {properties.map(p => (
               <PropertyCard key={p.id} property={p} />
             ))}
           </div>
         )}
       </div>
    </div>
  );
};
