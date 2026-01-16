import { useState, useEffect, useCallback } from 'react';
import { Property } from '../types/property';
import { propertiesApi } from '../api/properties';

export const useMyProperties = (pageSize = 5) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * pageSize;
      const data = await propertiesApi.getMyProperties(skip, pageSize);
      setProperties(data);
      setHasMore(data.length === pageSize);
    } catch (err) {
        console.error("Error fetching properties:", err);
        setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties, page, setPage, hasMore };
};
