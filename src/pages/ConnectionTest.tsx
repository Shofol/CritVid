import React from 'react';
import { ConnectionTest } from '@/components/ConnectionTest';
import { AppLayout } from '@/components/AppLayout';

export default function ConnectionTestPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
            <p className="text-gray-600">
              Testing connection to Supabase services after account restoration.
            </p>
          </div>
          
          <div className="flex justify-center">
            <ConnectionTest />
          </div>
          
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Connection Details:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Project URL:</strong> https://tasowytszirhdvdiwuia.supabase.co</li>
              <li>• <strong>Database:</strong> Testing table access and queries</li>
              <li>• <strong>Storage:</strong> Checking bucket availability</li>
              <li>• <strong>Auth:</strong> Verifying authentication service</li>
              <li>• <strong>Functions:</strong> Testing edge function endpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}