import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  Download, 
  Upload, 
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { UserSettings } from '../../types/userSettings';

interface UserSettingsPanelProps {
  onClose?: () => void;
}

const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({ onClose }) => {
  const { 
    settings, 
    loading, 
    error, 
    updateSetting, 
    updateSettings, 
    resetSettings, 
    exportSettings, 
    importSettings,
    forceSave 
  } = useUserSettings();

  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'privacy' | 'preferences' | 'data'>('appearance');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await updateSetting(key, value);
      showMessage('success', 'Setting updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update setting');
    }
  };

  const handleNestedSettingChange = async (parentKey: string, childKey: string, value: any) => {
    try {
      const updatedParent = {
        ...settings[parentKey as keyof UserSettings],
        [childKey]: value
      };
      await updateSetting(parentKey, updatedParent);
      showMessage('success', 'Setting updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update setting');
    }
  };

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    try {
      await resetSettings();
      showMessage('success', 'Settings reset to defaults');
    } catch (error) {
      showMessage('error', 'Failed to reset settings');
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportSettings = async () => {
    try {
      const exportedSettings = await exportSettings();
      if (exportedSettings) {
        const blob = new Blob([JSON.stringify(exportedSettings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pawbackhome-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('success', 'Settings exported successfully');
      }
    } catch (error) {
      showMessage('error', 'Failed to export settings');
    }
  };

  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      await importSettings(importedSettings);
      showMessage('success', 'Settings imported successfully');
    } catch (error) {
      showMessage('error', 'Failed to import settings. Please check the file format.');
    }
  };

  const handleForceSave = async () => {
    try {
      await forceSave();
      showMessage('success', 'All changes saved');
    } catch (error) {
      showMessage('error', 'Failed to save changes');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-kawaii shadow-kawaii p-8">
          <div className="w-16 h-16 border-4 border-kawaii-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-quicksand">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-kawaii shadow-kawaii max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-kawaii-purple/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-kawaii-purple-dark" />
              <h2 className="text-2xl font-bold text-gray-800">User Settings</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleForceSave}
                className="p-2 bg-kawaii-green hover:bg-kawaii-green-dark rounded-kawaii transition-colors duration-200"
                title="Save all changes"
              >
                <Save size={20} className="text-gray-700" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-kawaii transition-colors duration-200"
                >
                  <X size={24} className="text-gray-600" />
                </button>
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
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle size={16} className="flex-shrink-0" />
              ) : (
                <AlertTriangle size={16} className="flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex h-[calc(90vh-200px)]">
          
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
            <nav className="space-y-2">
              {[
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'privacy', label: 'Privacy & Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: User },
                { id: 'data', label: 'Data & Backup', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-kawaii text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-kawaii-purple text-gray-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-quicksand">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Appearance Settings</h3>
                
                {/* Theme */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Color Scheme */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color Scheme</label>
                  <select
                    value={settings.colorScheme}
                    onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                  >
                    <option value="default">Default</option>
                    <option value="high-contrast">High Contrast</option>
                    <option value="colorblind-friendly">Colorblind Friendly</option>
                  </select>
                </div>

                {/* Accessibility Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Accessibility</h4>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Reduce motion and animations</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">High contrast mode</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.keyboardNavigation}
                      onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Enhanced keyboard navigation</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h3>
                
                {/* Email Notifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications.petMatches}
                        onChange={(e) => handleNestedSettingChange('emailNotifications', 'petMatches', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-quicksand">Pet match alerts</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications.communityUpdates}
                        onChange={(e) => handleNestedSettingChange('emailNotifications', 'communityUpdates', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-quicksand">Community updates</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications.systemUpdates}
                        onChange={(e) => handleNestedSettingChange('emailNotifications', 'systemUpdates', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-quicksand">System updates</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications.marketingEmails}
                        onChange={(e) => handleNestedSettingChange('emailNotifications', 'marketingEmails', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-quicksand">Marketing emails</span>
                    </label>
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications.enabled}
                        onChange={(e) => handleNestedSettingChange('pushNotifications', 'enabled', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="font-quicksand">Enable push notifications</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications.petAlerts}
                        onChange={(e) => handleNestedSettingChange('pushNotifications', 'petAlerts', e.target.checked)}
                        className="w-4 h-4"
                        disabled={!settings.pushNotifications.enabled}
                      />
                      <span className="font-quicksand">Pet alerts</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications.messages}
                        onChange={(e) => handleNestedSettingChange('pushNotifications', 'messages', e.target.checked)}
                        className="w-4 h-4"
                        disabled={!settings.pushNotifications.enabled}
                      />
                      <span className="font-quicksand">Messages</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications.reminders}
                        onChange={(e) => handleNestedSettingChange('pushNotifications', 'reminders', e.target.checked)}
                        className="w-4 h-4"
                        disabled={!settings.pushNotifications.enabled}
                      />
                      <span className="font-quicksand">Reminders</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy & Security</h3>
                
                {/* Profile Visibility */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends-only">Friends Only</option>
                  </select>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Contact Information Visibility</h4>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.showEmail}
                      onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Show email address</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.showLocation}
                      onChange={(e) => handleSettingChange('showLocation', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Show location</span>
                  </label>
                </div>

                {/* Security */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Security</h4>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Enable two-factor authentication</span>
                  </label>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">User Preferences</h3>
                
                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Default Search Radius */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Default Search Radius: {settings.defaultSearchRadius}km
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={settings.defaultSearchRadius}
                    onChange={(e) => handleSettingChange('defaultSearchRadius', parseInt(e.target.value))}
                    className="w-full max-w-xs"
                  />
                </div>

                {/* Preferred Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Location</label>
                  <input
                    type="text"
                    value={settings.preferredLocation}
                    onChange={(e) => handleSettingChange('preferredLocation', e.target.value)}
                    className="kawaii-input w-full max-w-xs"
                    placeholder="Enter your preferred location"
                  />
                </div>

                {/* User Experience */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">User Experience</h4>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Auto-save changes</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.showTutorials}
                      onChange={(e) => handleSettingChange('showTutorials', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Show tutorials and tips</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.compactView}
                      onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-quicksand">Compact view</span>
                  </label>
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Data & Backup</h3>
                
                {/* Export/Import */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Backup & Restore</h4>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleExportSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-kawaii-blue hover:bg-kawaii-blue-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200"
                    >
                      <Download size={16} />
                      Export Settings
                    </button>
                    
                    <label className="flex items-center gap-2 px-4 py-2 bg-kawaii-green hover:bg-kawaii-green-dark text-gray-700 font-bold rounded-kawaii transition-colors duration-200 cursor-pointer">
                      <Upload size={16} />
                      Import Settings
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Reset</h4>
                  <div className="bg-red-50 border border-red-200 rounded-kawaii p-4">
                    <p className="text-red-700 font-quicksand mb-3">
                      This will reset all your settings to their default values. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleResetSettings}
                      disabled={isResetting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-kawaii transition-colors duration-200 disabled:opacity-50"
                    >
                      <RotateCcw size={16} />
                      {isResetting ? 'Resetting...' : 'Reset All Settings'}
                    </button>
                  </div>
                </div>

                {/* Settings Info */}
                <div className="bg-gray-50 rounded-kawaii p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Settings Information</h4>
                  <div className="text-sm text-gray-600 font-quicksand space-y-1">
                    <p>Version: {settings.version}</p>
                    <p>Last Updated: {new Date(settings.lastUpdated).toLocaleString()}</p>
                    <p>Auto-save: {settings.autoSave ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPanel;