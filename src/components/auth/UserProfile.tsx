import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit3, Save, X, Camera, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  // Debug auth state
  useEffect(() => {
    console.log('Auth state in UserProfile:', { user: !!user, profile });
  }, [user, profile]);

  if (!user || !profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    const { error } = await updateProfile({
      user_name: formData.user_name,
      avatar_url: formData.avatar_url
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      user_name: profile?.user_name || '',
      avatar_url: profile?.avatar_url || ''
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleSignOut = async () => {
    console.log('Sign out clicked from profile page');
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out from profile:', error);
      setMessage({ type: 'error', text: error.message });
    } else {
      console.log('Sign out successful from profile');
      // The redirect will happen automatically due to the protected route
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-kawaii shadow-kawaii border-2 border-kawaii-pink/30 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-kawaii-pink/20 border-b border-kawaii-pink/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-kawaii-blue hover:bg-kawaii-blue-dark rounded-kawaii transition-colors duration-200"
                  title="Edit Profile"
                >
                  <Edit3 size={20} className="text-gray-700" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="p-2 bg-kawaii-green hover:bg-kawaii-green-dark disabled:opacity-50 rounded-kawaii transition-colors duration-200"
                    title="Save Changes"
                  >
                    <Save size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-kawaii transition-colors duration-200"
                    title="Cancel"
                  >
                    <X size={20} className="text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-b border-green-200 text-green-800' 
              : 'bg-red-50 border-b border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {(isEditing ? formData.avatar_url : profile.avatar_url) ? (
                  <img 
                    src={isEditing ? formData.avatar_url : profile.avatar_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-kawaii-pink/30 flex items-center justify-center">
                    <User size={32} className="text-kawaii-pink-dark" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-kawaii-blue hover:bg-kawaii-blue-dark rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
                  <Camera size={16} className="text-gray-700" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                    className="kawaii-input w-full"
                    placeholder="Enter your display name"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{profile.user_name || 'Anonymous User'}</h3>
                  <p className="text-gray-600 font-quicksand">PawBackHome Member</p>
                </div>
              )}
            </div>
          </div>

          {/* Avatar URL Input (when editing) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                className="kawaii-input w-full"
                placeholder="Enter avatar image URL"
              />
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-kawaii">
              <Mail size={20} className="text-kawaii-blue-dark" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Email</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-kawaii">
              <Calendar size={20} className="text-kawaii-green-dark" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Member Since</p>
                <p className="text-gray-600">{formatDate(profile.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-kawaii-yellow/20 rounded-kawaii p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Your PawBackHome Activity</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-kawaii-pink-dark">0</div>
                <div className="text-sm text-gray-600">Pets Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kawaii-blue-dark">0</div>
                <div className="text-sm text-gray-600">Donations Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kawaii-green-dark">0</div>
                <div className="text-sm text-gray-600">Posts Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kawaii-purple-dark">0</div>
                <div className="text-sm text-gray-600">Community Points</div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-kawaii transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;