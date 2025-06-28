import React, { useState, useRef } from 'react';
import { Search, Upload, Heart, Home, CheckCircle, AlertTriangle, X, Camera } from 'lucide-react';
import { Link } from '../navigation/Link';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LostFoundSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Reset states
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPG, PNG, HEIC)');
      return;
    }

    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    // Simulate upload process with progress
    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setIsUploading(false);
          setUploadedImage(result);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enhanced "Help Pet Get Home" button handler with proper error handling
  const handleHelpPetGetHome = () => {
    try {
      console.log('Help Pet Get Home button clicked');
      console.log('Uploaded image exists:', !!uploadedImage);
      
      if (uploadedImage) {
        // Store image data in sessionStorage for transfer
        sessionStorage.setItem('transferredPetImage', uploadedImage);
        console.log('Image stored in sessionStorage');
        
        // Add timestamp to ensure fresh data
        sessionStorage.setItem('transferredPetImageTimestamp', Date.now().toString());
      }
      
      // Navigate to registry page with found pet form and auto-open
      const targetUrl = '/lost-found/registry?type=found&autoOpen=true';
      console.log('Navigating to:', targetUrl);
      
      // Use window.location.href for reliable navigation
      window.location.href = targetUrl;
      
    } catch (error) {
      console.error('Error in handleHelpPetGetHome:', error);
      // Fallback navigation without image transfer
      window.location.href = '/lost-found/registry?type=found&autoOpen=true';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="lost-found-section" className="py-16 relative scroll-mt-20">
      <div className="kawaii-container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home size={32} className="text-kawaii-yellow-dark" />
            <Heart size={28} className="text-kawaii-pink-dark fill-kawaii-pink-dark" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Lost & Found Pets
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-quicksand">
            Help reunite pets with their families by reporting found animals or searching for your lost companion
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Card className="flex-1 p-8">
            <div className="flex flex-col items-center text-center h-full">
              <Search size={48} className="text-kawaii-pink-dark mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Lost a Pet?</h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Search our database of found pets or report your missing furry friend
              </p>
              
              {/* Centered search input container */}
              <div className="w-full max-w-md mx-auto mb-6">
                <Input 
                  placeholder="🔍 Search by description, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-center"
                  aria-label="Search for lost pets by description or location"
                />
              </div>
              
              {/* Action buttons that link to registry */}
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-auto">
                <Link to="/lost-found/registry" className="flex-1">
                  <Button 
                    variant="primary" 
                    className="w-full justify-center"
                    aria-label="Search for lost pets in our registry"
                  >
                    Search Lost Pets
                  </Button>
                </Link>
                <Link to="/lost-found/registry?type=lost&autoOpen=true" className="flex-1">
                  <Button 
                    variant="blue" 
                    icon={<Upload size={18} />}
                    className="w-full justify-center"
                    aria-label="Report your lost pet to our registry"
                  >
                    Report Lost Pet
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 p-8">
            <div className="flex flex-col items-center text-center h-full">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={48} className="text-kawaii-pink-dark" />
                <Home size={32} className="text-kawaii-yellow-dark" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Found a Pet?</h3>
              <p className="text-gray-600 mb-6 font-quicksand">
                Report a found pet to help them get back home to their worried families
              </p>

              {/* Enhanced Photo Upload Area */}
              <div className="w-full mb-6 flex-grow flex flex-col">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Upload photo of found pet"
                />

                {uploadedImage ? (
                  /* Image Preview with improved scaling */
                  <div className="relative border-2 border-kawaii-green rounded-kawaii p-4 bg-kawaii-green/10">
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                      aria-label="Remove uploaded image"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                    <img
                      src={uploadedImage}
                      alt="Uploaded pet"
                      className="w-full h-48 object-contain rounded-kawaii mb-3 bg-white"
                    />
                    {uploadSuccess && (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <CheckCircle size={16} />
                        <span className="text-sm">Photo uploaded successfully!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Upload Area */
                  <div
                    className={`border-2 border-dashed rounded-kawaii p-8 text-center transition-all duration-300 cursor-pointer flex-grow flex flex-col justify-center ${
                      isDragOver
                        ? 'border-kawaii-green bg-kawaii-green/20 scale-105'
                        : 'border-kawaii-pink bg-kawaii-pink/10 hover:bg-kawaii-pink/20'
                    } ${isUploading ? 'pointer-events-none' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleUploadClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload area for pet photos - click or drag and drop"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUploadClick();
                      }
                    }}
                  >
                    <div className="flex flex-col items-center">
                      {isUploading ? (
                        <>
                          <Camera size={48} className="text-kawaii-blue-dark mb-4 animate-pulse" />
                          <div className="w-full max-w-xs mb-4">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-kawaii-blue-dark h-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Uploading... {Math.round(uploadProgress)}%
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={48} className="text-kawaii-pink-dark mb-4" />
                          <p className="text-gray-700 font-quicksand font-semibold mb-2">
                            {isDragOver ? 'Drop photo here!' : 'Drop or click to upload pet photo'}
                          </p>
                          <p className="text-sm text-gray-600">
                            JPG, PNG, HEIC (max 10MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {uploadError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-kawaii flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Enhanced "Help Pet Get Home" button with better error handling */}
              <div className="w-full mt-auto">
                <button
                  onClick={handleHelpPetGetHome}
                  className="w-full bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold py-3 px-6 rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                  aria-label="Help pet get home by reporting to our registry"
                  disabled={isUploading}
                >
                  <Heart size={18} />
                  Help Pet Get Home
                </button>
                
                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Debug: Image ready = {uploadedImage ? 'Yes' : 'No'}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/lost-found/registry">
            <Button 
              variant="primary"
              aria-label="View all pet reports in our comprehensive registry"
            >
              View All Reports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LostFoundSection;