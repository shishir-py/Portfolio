'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  previewUrl?: string;
  aspectRatio?: number;
  className?: string;
}

export default function ImageUpload({ 
  onImageSelected, 
  previewUrl, 
  aspectRatio = 1, 
  className = '' 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropCoords, setCropCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    setError('');
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, GIF)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setOriginalFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      
      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        onImageSelected(file, result);
        setIsUploading(false);
      };
      img.onerror = () => {
        setError('Failed to load image. Please try another one.');
        setIsUploading(false);
      };
      img.src = result;
    };
    
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelected(null, '');
    setOriginalFile(null);
  };
  
  const toggleCropMode = () => {
    setCropMode(!cropMode);
    
    if (!cropMode && imgRef.current) {
      // Initialize crop area to the center of the image
      const img = imgRef.current;
      const width = Math.min(img.naturalWidth, img.naturalHeight) * 0.8;
      const height = width / aspectRatio;
      const x = (img.naturalWidth - width) / 2;
      const y = (img.naturalHeight - height) / 2;
      
      setCropCoords({ x, y, width, height });
    }
  };
  
  const applyCrop = () => {
    if (!imgRef.current || !cropCoords || !canvasRef.current || !originalFile) return;
    
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions to the crop size
    canvas.width = cropCoords.width;
    canvas.height = cropCoords.height;
    
    // Calculate scaling factor (if the displayed image is resized)
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    // Draw only the cropped portion to the canvas
    ctx.drawImage(
      img,
      cropCoords.x * scaleX,
      cropCoords.y * scaleY,
      cropCoords.width * scaleX,
      cropCoords.height * scaleY,
      0,
      0,
      cropCoords.width,
      cropCoords.height
    );
    
    // Convert the canvas to a data URL in the original file's format
    const mimeType = originalFile.type;
    const dataUrl = canvas.toDataURL(mimeType, 0.9);
    
    // Convert data URL to a Blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        // Create a new File from the blob
        const croppedFile = new File([blob], originalFile.name, { 
          type: mimeType,
          lastModified: new Date().getTime()
        });
        
        // Pass the cropped file and preview URL to the parent component
        onImageSelected(croppedFile, dataUrl);
        setCropMode(false);
      })
      .catch(err => {
        console.error('Error cropping image:', err);
        setError('Failed to crop image. Please try again.');
      });
  };
  
  // Update crop coordinates when mouse moves
  const updateCropCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calculate position relative to the image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate width and height based on aspect ratio
    const size = Math.min(img.width, img.height) * 0.3;
    const width = size;
    const height = width / aspectRatio;
    
    // Ensure the crop region stays within image bounds
    const finalX = Math.max(0, Math.min(img.width - width, x - width / 2));
    const finalY = Math.max(0, Math.min(img.height - height, y - height / 2));
    
    setCropCoords({
      x: finalX,
      y: finalY,
      width,
      height
    });
  };
  
  return (
    <div className={className}>
      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-md p-6 cursor-pointer flex flex-col items-center justify-center h-48 transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isDragging ? 'Drop image here' : 'Drag and drop image or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG or GIF, max 5MB</p>
          
          {isUploading && (
            <div className="mt-2">
              <div className="animate-pulse flex space-x-2 items-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <p className="text-sm text-blue-600">Uploading...</p>
              </div>
            </div>
          )}
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-gray-300">
          <div 
            className="relative h-48 bg-gray-100"
            onClick={cropMode ? updateCropCoords : undefined}
          >
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Image preview"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
            
            {cropMode && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 cursor-crosshair"
              >
                <div 
                  className="border-2 border-white absolute" 
                  style={{
                    left: `${cropCoords.x}px`,
                    top: `${cropCoords.y}px`,
                    width: `${cropCoords.width}px`,
                    height: `${cropCoords.height}px`,
                  }}
                />
                <p className="text-white text-xs absolute bottom-2 left-2">
                  Click anywhere to move crop area
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-3 py-1 text-xs text-blue-700 hover:text-blue-800 font-medium"
              >
                Change
              </button>
              <button
                type="button"
                onClick={toggleCropMode}
                className={`px-3 py-1 text-xs ${
                  cropMode 
                    ? 'text-gray-700 hover:text-gray-800' 
                    : 'text-blue-700 hover:text-blue-800'
                } font-medium`}
              >
                {cropMode ? 'Cancel Crop' : 'Crop'}
              </button>
              {cropMode && (
                <button
                  type="button"
                  onClick={applyCrop}
                  className="px-3 py-1 text-xs text-green-700 hover:text-green-800 font-medium"
                >
                  Apply Crop
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="px-3 py-1 text-xs text-red-700 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
} 