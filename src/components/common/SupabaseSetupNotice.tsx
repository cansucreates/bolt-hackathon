import React from 'react';
import { AlertCircle, Database } from 'lucide-react';

export const SupabaseSetupNotice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Database Setup Required
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          This pet care application needs to connect to Supabase to function properly.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Quick Setup:</p>
              <p>Click the "Connect to Supabase" button in the top right corner to automatically configure your database connection.</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-2">Manual Setup:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Update your .env file with Supabase credentials</li>
            <li>Restart the development server</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  );
};