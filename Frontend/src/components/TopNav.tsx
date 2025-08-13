import { Bell, Search, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { apiRequest } from '../lib/apiClient';

export const TopNav = () => {
  const { user, refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePictureClick = () => {
    console.log('Profile picture clicked!'); // Debug log
    // Trigger file input for profile picture upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none'; // Hide the input
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file.name); // Debug log
        await uploadProfilePicture(file);
      }
    };
    document.body.appendChild(input); // Add to DOM
    input.click();
    // Clean up after a delay
    setTimeout(() => {
      document.body.removeChild(input);
    }, 1000);
  };

  const uploadProfilePicture = async (file: File) => {
    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      const apiBaseUrl = import.meta.env.VITE_API_URL;
      await apiRequest(`${apiBaseUrl}/users/${user?.id}/profile-picture`, {
        method: 'PATCH',
        body: formData,
      });
      await refreshUser();
      console.log('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-30 h-16 bg-card border-b border-border px-4 md:px-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
      {/* Search: left on desktop, right on mobile */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Notifications + Profile */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
        </button>

        <div className="hidden md:flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {typeof user?.department === 'string'
                ? user.department
                : (user?.department as any)?.name || 'No Department'}
            </p>
          </div>

          {/* Profile Picture with Upload Functionality */}
          <div className="relative group">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-80 transition-opacity ${isUploading ? 'opacity-50' : ''} hover:ring-2 hover:ring-primary`}
              onClick={handleProfilePictureClick}
              title="Click to change profile picture"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Upload Icon Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-none">
              <Camera className="w-3 h-3 text-white" />
            </div>

            {/* Loading Indicator */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
