import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Get the storage key based on whether user is logged in
  const getStorageKey = () => {
    if (user) {
      return `favorites_user_${user.id}`;
    }
    return "favorites_guest";
  };

  // Load favorites when component mounts or user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user?.id]); // Re-load when user changes

  const saveFavorites = (favs: number[]) => {
    setFavorites(favs);
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(favs));
  };

  const addFavorite = (id: number) => {
    if (!favorites.includes(id)) {
      saveFavorites([...favorites, id]);
    }
  };

  const removeFavorite = (id: number) => {
    saveFavorites(favorites.filter(fid => fid !== id));
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
