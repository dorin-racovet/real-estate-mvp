import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter(
        (file) => file.type.startsWith('image/')
      );
      onFilesSelected(validFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-testid="image-upload-zone"
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="text-gray-600 font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            SVG, PNG, JPG or GIF (max 10MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          data-testid="file-input"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="image-preview-grid">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group border rounded-lg overflow-hidden h-24" data-testid="image-preview">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(index);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
