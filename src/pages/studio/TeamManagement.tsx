import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';

const TeamManagement: React.FC = () => {
  const { setPrivateCritiqueMode } = useApp();

  useEffect(() => {
    // Ensure private critique mode is enabled for studio owner pages
    setPrivateCritiqueMode(true);
    
    return () => {
      // Clean up when component unmounts
      setPrivateCritiqueMode(false);
    };
  }, [setPrivateCritiqueMode]);

  // Mock data for team members
  const teamMembers = [
    { id: 1, name: 'Jane Smith', role: 'Lead Instructor', email: 'jane@example.com' },
    { id: 2, name: 'Robert Johnson', role: 'Ballet Instructor', email: 'robert@example.com' },
    { id: 3, name: 'Maria Garcia', role: 'Jazz Instructor', email: 'maria@example.com' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            Add Team Member
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Studio Team</h2>
            <p className="text-gray-600">Manage your studio instructors and staff</p>
          </div>
          
          <div className="divide-y">
            {teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <div key={member.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role} • {member.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90">
                      Edit
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>You haven't added any team members yet.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Team Permissions</h2>
          <p className="text-gray-600 mb-4">
            Control what your team members can access and edit within your studio account.
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm italic text-gray-500">
              Team permission settings will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeamManagement;
