import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Property } from "../../types/property";
import { propertiesApi } from "../../api/properties";

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.images) {
        setCurrentImageIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
    }
  }, [property]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.images) {
        setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
    }
  }, [property]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeGallery();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, nextImage, prevImage]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await propertiesApi.getProperty(parseInt(id));
        setProperty(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(`http://localhost:8000/${data.images[0]}`);
        }
      } catch (err) {
        setError("Failed to load property details. It might not exist or has been removed.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-8 text-lg">{error || "Property not found"}</p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  // Formatting
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb / Back Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-gray-500 hover:text-indigo-600 flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-1">
              <div 
                className="relative h-[50vh] md:h-[65vh] bg-gray-100 rounded-xl overflow-hidden mb-2 group cursor-pointer"
                onClick={() => {
                   if (property.images && property.images.length > 0) {
                       const foundIndex = property.images.findIndex(img => activeImage?.includes(img));
                       openGallery(foundIndex !== -1 ? foundIndex : 0);
                   }
                }}
              >
                {activeImage ? (
                  <>
                    <img
                      src={activeImage}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                            <Maximize2 className="w-4 h-4" />
                            View Fullscreen
                        </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Images Available
                  </div>
                )}
                 <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {property.status}
                 </div>
              </div>
              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(`http://localhost:8000/${img}`)}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        activeImage === `http://localhost:8000/${img}`
                          ? "border-indigo-600"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={`http://localhost:8000/${img}`}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-500 flex items-center text-lg">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {property.city}
                  </p>
                </div>
                <div className="text-3xl font-bold text-indigo-600">
                  {formattedPrice}
                </div>
              </div>

              <div className="border-t border-gray-100 py-6">
                 <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                         <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Type</span>
                         <span className="text-gray-800 font-semibold">{property.property_type.replace('_', ' ')}</span>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-xl text-center">
                         <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Surface</span>
                         <span className="text-gray-800 font-semibold">{property.surface} m²</span>
                    </div>
                     {/* Placeholders for Rooms/Baths until added to model */}
                     <div className="bg-gray-50 p-4 rounded-xl text-center opacity-50">
                         <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Bedrooms</span>
                         <span className="text-gray-800 font-semibold">-</span>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-xl text-center opacity-50">
                         <span className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Bathrooms</span>
                         <span className="text-gray-800 font-semibold">-</span>
                    </div>
                 </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                 <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                 <div className="prose text-gray-600 max-w-none">
                     {property.description ? (
                         <p>{property.description}</p>
                     ) : (
                         <p className="italic text-gray-400">No description provided for this property.</p>
                     )}
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact / Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Agent</h3>
                
                <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {property.agent?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="ml-4">
                        <p className="text-gray-900 font-bold">{property.agent?.name || 'Listing Agent'}</p>
                        <p className="text-gray-500 text-sm">Real Estate Agent</p>
                    </div>
                </div>

                <a 
                    href={`mailto:${property.agent?.email}`}
                    className="block w-full text-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mb-4"
                >
                    Send Message
                </a>
                
                {property.agent?.phone ? (
                    <a 
                         href={`tel:${property.agent.phone}`}
                         className="block w-full text-center bg-white text-indigo-600 font-bold py-3 px-4 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition"
                    >
                        Call Agent
                    </a>
                ) : (
                    <button 
                        disabled 
                        className="w-full bg-gray-100 text-gray-400 font-bold py-3 px-4 rounded-xl border border-gray-200 cursor-not-allowed"
                    >
                        No Phone Available
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && property?.images && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={closeGallery}>
            <button 
                onClick={closeGallery}
                className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition z-50"
            >
                <X className="w-8 h-8" />
            </button>

            <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full transition z-50"
            >
                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <img
                src={`http://localhost:8000/${property.images[currentImageIndex]}`}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
            />

            <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 text-white/70 hover:text-white hover:bg-white/10 p-3 rounded-full transition z-50"
            >
                <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 bg-black/50 rounded-full backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                {property.images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-16 h-12 md:w-20 md:h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex ? 'border-indigo-500 scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                    >
                         <img
                            src={`http://localhost:8000/${img}`}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-cover"
                         />
                    </button>
                ))}
            </div>
            
            <div className="absolute top-6 left-6 text-white font-medium bg-black/40 px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {property.images.length}
            </div>
        </div>
      )}
    </div>
  );
};
