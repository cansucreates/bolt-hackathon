import { supabase } from './supabase';
import { UserSettings, UserSettingsUpdate, SettingsResponse, DEFAULT_USER_SETTINGS } from '../types/userSettings';

// Cache for user settings to reduce database calls
const settingsCache = new Map<string, { settings: UserSettings; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce function for auto-save
const debounceMap = new Map<string, NodeJS.Timeout>();

/**
 * Fetch user settings from database with caching
 */
export const fetchUserSettings = async (userId: string): Promise<SettingsResponse> => {
  try {
    // Check cache first
    const cached = settingsCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { data: cached.settings };
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('settings_data, updated_at')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, create default settings
        console.log('No settings found for user, creating defaults');
        return await createDefaultSettings(userId);
      }
      
      console.error('Error fetching user settings:', error);
      return { 
        error: { 
          message: 'Failed to fetch user settings', 
          code: error.code 
        } 
      };
    }

    // Merge with defaults to ensure all properties exist
    const userSettings: UserSettings = {
      ...DEFAULT_USER_SETTINGS,
      ...data.settings_data,
      lastUpdated: data.updated_at,
    };

    // Update cache
    settingsCache.set(userId, {
      settings: userSettings,
      timestamp: Date.now(),
    });

    return { data: userSettings };
  } catch (error) {
    console.error('Unexpected error fetching user settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while fetching settings' 
      } 
    };
  }
};

/**
 * Create default settings for a new user
 */
export const createDefaultSettings = async (userId: string): Promise<SettingsResponse> => {
  try {
    const defaultSettings = {
      ...DEFAULT_USER_SETTINGS,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_settings')
      .insert([{
        user_id: userId,
        settings_data: defaultSettings,
      }])
      .select('settings_data, updated_at')
      .single();

    if (error) {
      console.error('Error creating default settings:', error);
      return { 
        error: { 
          message: 'Failed to create default settings', 
          code: error.code 
        } 
      };
    }

    const userSettings: UserSettings = {
      ...defaultSettings,
      lastUpdated: data.updated_at,
    };

    // Update cache
    settingsCache.set(userId, {
      settings: userSettings,
      timestamp: Date.now(),
    });

    return { data: userSettings };
  } catch (error) {
    console.error('Unexpected error creating default settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while creating default settings' 
      } 
    };
  }
};

/**
 * Update user settings with debouncing for auto-save
 */
export const updateUserSettings = async (
  userId: string, 
  updates: UserSettingsUpdate,
  immediate: boolean = false
): Promise<SettingsResponse> => {
  try {
    // Get current settings from cache or database
    const currentResponse = await fetchUserSettings(userId);
    if (currentResponse.error || !currentResponse.data) {
      return currentResponse;
    }

    // Merge updates with current settings
    const updatedSettings: UserSettings = {
      ...currentResponse.data,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    // Update cache immediately for responsive UI
    settingsCache.set(userId, {
      settings: updatedSettings,
      timestamp: Date.now(),
    });

    // Handle debouncing for auto-save
    if (!immediate) {
      // Clear existing debounce timer
      const existingTimer = debounceMap.get(userId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(async () => {
        await saveSettingsToDatabase(userId, updatedSettings);
        debounceMap.delete(userId);
      }, 1000); // 1 second debounce

      debounceMap.set(userId, timer);
      
      return { data: updatedSettings };
    }

    // Immediate save
    return await saveSettingsToDatabase(userId, updatedSettings);
  } catch (error) {
    console.error('Unexpected error updating user settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while updating settings' 
      } 
    };
  }
};

/**
 * Save settings to database
 */
const saveSettingsToDatabase = async (
  userId: string, 
  settings: UserSettings
): Promise<SettingsResponse> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        settings_data: settings,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('settings_data, updated_at')
      .single();

    if (error) {
      console.error('Error saving settings to database:', error);
      return { 
        error: { 
          message: 'Failed to save settings', 
          code: error.code 
        } 
      };
    }

    const savedSettings: UserSettings = {
      ...settings,
      lastUpdated: data.updated_at,
    };

    // Update cache with saved data
    settingsCache.set(userId, {
      settings: savedSettings,
      timestamp: Date.now(),
    });

    return { data: savedSettings };
  } catch (error) {
    console.error('Unexpected error saving settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while saving settings' 
      } 
    };
  }
};

/**
 * Force save any pending changes immediately
 */
export const forceSaveSettings = async (userId: string): Promise<void> => {
  const timer = debounceMap.get(userId);
  if (timer) {
    clearTimeout(timer);
    debounceMap.delete(userId);
    
    const cached = settingsCache.get(userId);
    if (cached) {
      await saveSettingsToDatabase(userId, cached.settings);
    }
  }
};

/**
 * Reset user settings to defaults
 */
export const resetUserSettings = async (userId: string): Promise<SettingsResponse> => {
  try {
    const defaultSettings = {
      ...DEFAULT_USER_SETTINGS,
      lastUpdated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_settings')
      .update({
        settings_data: defaultSettings,
      })
      .eq('user_id', userId)
      .select('settings_data, updated_at')
      .single();

    if (error) {
      console.error('Error resetting user settings:', error);
      return { 
        error: { 
          message: 'Failed to reset settings', 
          code: error.code 
        } 
      };
    }

    const resetSettings: UserSettings = {
      ...defaultSettings,
      lastUpdated: data.updated_at,
    };

    // Update cache
    settingsCache.set(userId, {
      settings: resetSettings,
      timestamp: Date.now(),
    });

    return { data: resetSettings };
  } catch (error) {
    console.error('Unexpected error resetting settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while resetting settings' 
      } 
    };
  }
};

/**
 * Delete user settings (for account deletion)
 */
export const deleteUserSettings = async (userId: string): Promise<{ error?: SettingsError }> => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user settings:', error);
      return { 
        error: { 
          message: 'Failed to delete settings', 
          code: error.code 
        } 
      };
    }

    // Clear cache
    settingsCache.delete(userId);
    
    // Clear any pending debounce timers
    const timer = debounceMap.get(userId);
    if (timer) {
      clearTimeout(timer);
      debounceMap.delete(userId);
    }

    return {};
  } catch (error) {
    console.error('Unexpected error deleting settings:', error);
    return { 
      error: { 
        message: 'An unexpected error occurred while deleting settings' 
      } 
    };
  }
};

/**
 * Clear settings cache (useful for testing or manual cache invalidation)
 */
export const clearSettingsCache = (userId?: string): void => {
  if (userId) {
    settingsCache.delete(userId);
  } else {
    settingsCache.clear();
  }
};

/**
 * Export user settings for backup
 */
export const exportUserSettings = async (userId: string): Promise<SettingsResponse> => {
  const response = await fetchUserSettings(userId);
  if (response.data) {
    // Add export metadata
    const exportData = {
      ...response.data,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0',
    };
    return { data: exportData as UserSettings };
  }
  return response;
};

/**
 * Import user settings from backup
 */
export const importUserSettings = async (
  userId: string, 
  importedSettings: Partial<UserSettings>
): Promise<SettingsResponse> => {
  try {
    // Validate and merge with defaults
    const validatedSettings: UserSettings = {
      ...DEFAULT_USER_SETTINGS,
      ...importedSettings,
      lastUpdated: new Date().toISOString(),
    };

    return await updateUserSettings(userId, validatedSettings, true);
  } catch (error) {
    console.error('Error importing user settings:', error);
    return { 
      error: { 
        message: 'Failed to import settings' 
      } 
    };
  }
};