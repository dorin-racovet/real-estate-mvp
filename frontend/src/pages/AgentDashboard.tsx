import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyForm } from '../components/property/PropertyForm';
import { PropertyTable } from '../components/property/PropertyTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useMyProperties } from '../hooks/useProperties';
import { propertiesApi } from '../api/properties';
import { Plus, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { properties, loading, refetch, page, setPage, hasMore } = useMyProperties();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });

  const handleDelete = (id: number) => {
    setDeleteConfirmation({ isOpen: true, id });
  };

  const confirmDelete = async () => {
      if (deleteConfirmation.id) {
          try {
              await propertiesApi.delete(deleteConfirmation.id);
              await refetch();
          } catch (error) {
              console.error("Failed to delete property", error);
              alert("Failed to delete property");
          }
          setDeleteConfirmation({ isOpen: false, id: null });
      }
  };

  const handleToggleStatus = async (id: number) => {
      const property = properties.find(p => p.id === id);
      if (!property) return;

      const newStatus = property.status === 'draft' ? 'published' : 'draft';
      try {
          await propertiesApi.update(id, { status: newStatus });
          await refetch();
      } catch (error) {
          console.error("Failed to update status", error);
          alert("Failed to update status");
      }
  };

  const handleEdit = (id: number) => {
      navigate(`/properties/${id}/edit`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
        <div className="flex space-x-3">
            <Link 
                to="/"
                className="flex items-center space-x-2 bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
            >
                <Globe size={20} />
                <span>View Properties</span>
            </Link>
            <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'Add Property'}</span>
            </button>
        </div>
      </div>

      {showForm ? (
        <div className="mb-6">
          <PropertyForm />
        </div>
      ) : (
        <>
          <PropertyTable 
              properties={properties} 
              isLoading={loading} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
          />
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-600 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
      
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
            <p className="text-gray-600">
                Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
                <Button 
                    variant="secondary" 
                    onClick={() => setDeleteConfirmation({ isOpen: false, id: null })}
                >
                    Cancel
                </Button>
                <Button 
                    variant="danger" 
                    onClick={confirmDelete}
                >
                    Delete Property
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
