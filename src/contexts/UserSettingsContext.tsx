import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserSettings, UserSettingsUpdate, DEFAULT_USER_SETTINGS } from '../types/userSettings';
import { 
  fetchUserSettings, 
  updateUserSettings, 
  forceSaveSettings,
  resetUserSettings,
  exportUserSettings,
  importUserSettings 
} from '../lib/userSettingsService';
import { useAuth } from './AuthContext';

interface UserSettingsContextType {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
  updateSetting: (key: string, value: any) => Promise<void>;
  updateSettings: (updates: UserSettingsUpdate, immediate?: boolean) => Promise<void>;
  resetSettings: () => Promise<void>;
  exportSettings: () => Promise<UserSettings | null>;
  importSettings: (settings: Partial<UserSettings>) => Promise<void>;
  forceSave: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

interface UserSettingsProviderProps {
  children: React.ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings when user changes
  const loadSettings = useCallback(async () => {
    if (!user?.id) {
      setSettings(DEFAULT_USER_SETTINGS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchUserSettings(user.id);
      
      if (response.error) {
        console.error('Failed to load user settings:', response.error);
        setError(response.error.message);
        setSettings(DEFAULT_USER_SETTINGS);
      } else if (response.data) {
        setSettings(response.data);
        
        // Apply settings to the application
        applySettingsToApp(response.data);
      }
    } catch (error) {
      console.error('Unexpected error loading settings:', error);
      setError('Failed to load user settings');
      setSettings(DEFAULT_USER_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Apply settings to the application (theme, accessibility, etc.)
  const applySettingsToApp = useCallback((userSettings: UserSettings) => {
    try {
      // Apply theme
      document.documentElement.setAttribute('data-theme', userSettings.theme);
      
      // Apply font size
      document.documentElement.setAttribute('data-font-size', userSettings.fontSize);
      
      // Apply reduced motion
      if (userSettings.reducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
      }
      
      // Apply high contrast
      if (userSettings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      // Apply color scheme
      document.documentElement.setAttribute('data-color-scheme', userSettings.colorScheme);
      
      // Set language
      document.documentElement.lang = userSettings.language;
      
      console.log('Applied user settings to application');
    } catch (error) {
      console.error('Error applying settings to app:', error);
    }
  }, []);

  // Load settings on mount and when user changes
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Force save settings when user logs out or page unloads
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user?.id) {
        await forceSaveSettings(user.id);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && user?.id) {
        await forceSaveSettings(user.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id]);

  // Update a single setting
  const updateSetting = useCallback(async (key: string, value: any) => {
    if (!user?.id) {
      console.warn('Cannot update settings: user not authenticated');
      return;
    }

    try {
      const updates = { [key]: value };
      const response = await updateUserSettings(user.id, updates);
      
      if (response.error) {
        console.error('Failed to update setting:', response.error);
        setError(response.error.message);
      } else if (response.data) {
        setSettings(response.data);
        applySettingsToApp(response.data);
      }
    } catch (error) {
      console.error('Unexpected error updating setting:', error);
      setError('Failed to update setting');
    }
  }, [user?.id, applySettingsToApp]);

  // Update multiple settings
  const updateSettings = useCallback(async (updates: UserSettingsUpdate, immediate: boolean = false) => {
    if (!user?.id) {
      console.warn('Cannot update settings: user not authenticated');
      return;
    }

    try {
      const response = await updateUserSettings(user.id, updates, immediate);
      
      if (response.error) {
        console.error('Failed to update settings:', response.error);
        setError(response.error.message);
      } else if (response.data) {
        setSettings(response.data);
        applySettingsToApp(response.data);
      }
    } catch (error) {
      console.error('Unexpected error updating settings:', error);
      setError('Failed to update settings');
    }
  }, [user?.id, applySettingsToApp]);

  // Reset settings to defaults
  const resetSettings = useCallback(async () => {
    if (!user?.id) {
      console.warn('Cannot reset settings: user not authenticated');
      return;
    }

    try {
      const response = await resetUserSettings(user.id);
      
      if (response.error) {
        console.error('Failed to reset settings:', response.error);
        setError(response.error.message);
      } else if (response.data) {
        setSettings(response.data);
        applySettingsToApp(response.data);
      }
    } catch (error) {
      console.error('Unexpected error resetting settings:', error);
      setError('Failed to reset settings');
    }
  }, [user?.id, applySettingsToApp]);

  // Export settings
  const exportSettings = useCallback(async (): Promise<UserSettings | null> => {
    if (!user?.id) {
      console.warn('Cannot export settings: user not authenticated');
      return null;
    }

    try {
      const response = await exportUserSettings(user.id);
      
      if (response.error) {
        console.error('Failed to export settings:', response.error);
        setError(response.error.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error('Unexpected error exporting settings:', error);
      setError('Failed to export settings');
      return null;
    }
  }, [user?.id]);

  // Import settings
  const importSettings = useCallback(async (importedSettings: Partial<UserSettings>) => {
    if (!user?.id) {
      console.warn('Cannot import settings: user not authenticated');
      return;
    }

    try {
      const response = await importUserSettings(user.id, importedSettings);
      
      if (response.error) {
        console.error('Failed to import settings:', response.error);
        setError(response.error.message);
      } else if (response.data) {
        setSettings(response.data);
        applySettingsToApp(response.data);
      }
    } catch (error) {
      console.error('Unexpected error importing settings:', error);
      setError('Failed to import settings');
    }
  }, [user?.id, applySettingsToApp]);

  // Force save pending changes
  const forceSave = useCallback(async () => {
    if (!user?.id) return;

    try {
      await forceSaveSettings(user.id);
    } catch (error) {
      console.error('Error force saving settings:', error);
    }
  }, [user?.id]);

  // Refresh settings from database
  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  const value = {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    forceSave,
    refreshSettings,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};