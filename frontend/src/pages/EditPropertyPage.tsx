import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyForm } from '../components/property/PropertyForm';
import { propertiesApi } from '../api/properties';
import { Property } from '../types/property';
import { useAuth } from '../context/AuthContext';

export const EditPropertyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            try {
                const data = await propertiesApi.getProperty(Number(id));
                setProperty(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load property');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleSuccess = () => {
         setTimeout(() => {
             if (user?.role === 'admin') {
                 navigate('/admin/properties');
             } else {
                 navigate('/dashboard');
             }
         }, 1500);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!property) return <div>Property not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
            <PropertyForm initialData={property} onSuccess={handleSuccess} />
        </div>
    );
};

