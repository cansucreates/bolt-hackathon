export interface UserSettings {
  // Theme and appearance
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'default' | 'high-contrast' | 'colorblind-friendly';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  
  // Notifications
  emailNotifications: {
    petMatches: boolean;
    communityUpdates: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    petAlerts: boolean;
    messages: boolean;
    reminders: boolean;
  };
  
  // Privacy and security
  profileVisibility: 'public' | 'private' | 'friends-only';
  showEmail: boolean;
  showLocation: boolean;
  twoFactorEnabled: boolean;
  
  // Search and filters
  defaultSearchRadius: number; // in kilometers
  preferredLocation: string;
  savedSearchFilters: {
    petType: string[];
    ageRange: string[];
    location: string;
  };
  
  // User experience
  language: string;
  timezone: string;
  autoSave: boolean;
  showTutorials: boolean;
  compactView: boolean;
  
  // Pet preferences (for better matching)
  petPreferences: {
    species: string[];
    sizes: string[];
    ages: string[];
    specialNeeds: boolean;
  };
  
  // Dashboard customization
  dashboardLayout: {
    widgets: string[];
    order: number[];
    collapsed: string[];
  };
  
  // Communication preferences
  preferredContactMethod: 'email' | 'phone' | 'app';
  responseTimeExpectation: 'immediate' | 'within-hour' | 'within-day' | 'flexible';
  
  // Accessibility
  screenReader: boolean;
  highContrast: boolean;
  keyboardNavigation: boolean;
  
  // Data and storage
  dataRetention: number; // in days
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  
  // Version for migration purposes
  version: string;
  lastUpdated: string;
}

export interface UserSettingsUpdate {
  [key: string]: any;
}

export interface SettingsError {
  message: string;
  code?: string;
  field?: string;
}

export interface SettingsResponse {
  data?: UserSettings;
  error?: SettingsError;
}

// Default settings that will be applied for new users
export const DEFAULT_USER_SETTINGS: UserSettings = {
  // Theme and appearance
  theme: 'light',
  colorScheme: 'default',
  fontSize: 'medium',
  reducedMotion: false,
  
  // Notifications
  emailNotifications: {
    petMatches: true,
    communityUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
  },
  pushNotifications: {
    enabled: true,
    petAlerts: true,
    messages: true,
    reminders: true,
  },
  
  // Privacy and security
  profileVisibility: 'public',
  showEmail: false,
  showLocation: true,
  twoFactorEnabled: false,
  
  // Search and filters
  defaultSearchRadius: 25,
  preferredLocation: '',
  savedSearchFilters: {
    petType: [],
    ageRange: [],
    location: '',
  },
  
  // User experience
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  autoSave: true,
  showTutorials: true,
  compactView: false,
  
  // Pet preferences
  petPreferences: {
    species: [],
    sizes: [],
    ages: [],
    specialNeeds: false,
  },
  
  // Dashboard customization
  dashboardLayout: {
    widgets: ['recent-activity', 'saved-searches', 'quick-actions'],
    order: [0, 1, 2],
    collapsed: [],
  },
  
  // Communication preferences
  preferredContactMethod: 'email',
  responseTimeExpectation: 'within-day',
  
  // Accessibility
  screenReader: false,
  highContrast: false,
  keyboardNavigation: false,
  
  // Data and storage
  dataRetention: 365,
  backupFrequency: 'weekly',
  
  // Version
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};