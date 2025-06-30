import React, { useState } from 'react';
import { X, Send, Image, AlertTriangle, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../lib/communityService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear error if exists
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrors({ auth: 'You must be logged in to create a post' });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      console.log('Creating post with data:', { title, content, category, tags });
      
      // Process tags
      const processedTags = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
      
      const result = await createPost({
        title,
        content,
        category,
        tags: processedTags,
        imageFile
      });
      
      if (result.error) {
        console.error('Error creating post:', result.error);
        setErrors({ submit: result.error });
        setIsSubmitting(false);
      } else {
        console.log('Post created successfully:', result.data);
        // Success - clear form and close modal
        setSubmitSuccess(true);
        setTimeout(() => {
          setTitle('');
          setContent('');
          setCategory('');
          setTags('');
          setImageFile(null);
          setImagePreview(null);
          setSubmitSuccess(false);
          onPostCreated();
        }, 1500);
      }
    } catch (error) {
      console.error('Unexpected error creating post:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-kawaii-purple/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Tag size={24} className="text-kawaii-purple-dark" />
              Ask a Question
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              disabled={isSubmitting}
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Summary */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-kawaii flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-kawaii flex items-center gap-2">
              <div className="text-green-600 flex-shrink-0">✓</div>
              <p className="text-green-700">Post created successfully!</p>
            </div>
          )}
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question about?"
              className={`kawaii-input w-full ${errors.title ? 'border-red-300' : ''}`}
              disabled={isSubmitting || submitSuccess}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.title}
              </p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`kawaii-input w-full ${errors.category ? 'border-red-300' : ''}`}
              disabled={isSubmitting || submitSuccess}
            >
              <option value="">Select a category</option>
              <option value="health">Pet Health</option>
              <option value="behavior">Behavior & Training</option>
              <option value="care">General Care</option>
              <option value="emergency">Emergency Help</option>
              <option value="adoption">Adoption & Rescue</option>
              <option value="general">General Discussion</option>
            </select>
            {errors.category && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.category}
              </p>
            )}
          </div>
          
          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question or topic in detail..."
              className={`kawaii-input w-full h-40 resize-none ${errors.content ? 'border-red-300' : ''}`}
              disabled={isSubmitting || submitSuccess}
            />
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.content}
                </p>
              ) : (
                <p className="text-xs text-gray-500">Minimum 20 characters</p>
              )}
              <p className="text-xs text-gray-500">{content.length}/2000</p>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas (e.g., dog, training, puppy)"
              className="kawaii-input w-full"
              disabled={isSubmitting || submitSuccess}
            />
            <p className="text-xs text-gray-500 mt-1">
              Add relevant tags to help others find your post
            </p>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Image (optional)
            </label>
            
            {imagePreview ? (
              <div className="relative mb-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-60 object-contain rounded-kawaii border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200"
                  disabled={isSubmitting || submitSuccess}
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-kawaii-purple/30 rounded-kawaii p-6 text-center hover:bg-kawaii-purple/10 transition-colors duration-200">
                    <Image size={32} className="text-kawaii-purple-dark mx-auto mb-2" />
                    <p className="text-gray-700 font-quicksand mb-1">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting || submitSuccess}
                  />
                </label>
                {errors.image && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {errors.image}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-kawaii text-gray-700 font-bold hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting || submitSuccess}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !user || submitSuccess}
              className="flex-1 py-3 px-4 bg-kawaii-purple hover:bg-kawaii-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : submitSuccess ? (
                <>
                  <div className="text-green-600">✓</div>
                  Posted Successfully!
                </>
              ) : (
                <>
                  <Send size={18} />
                  Post Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;