import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

const PendingCritiques: React.FC = () => {
  // Mock data for pending critiques
  const pendingCritiques = [
    { id: 1, title: 'Ballet Solo - Advanced', student: 'Emma Johnson', requestedAt: '2023-05-15', dueDate: '2023-05-22' },
    { id: 2, title: 'Contemporary Group Performance', student: 'Westside Dance Academy', requestedAt: '2023-05-14', dueDate: '2023-05-21' },
    { id: 3, title: 'Jazz Technique Assessment', student: 'Michael Chen', requestedAt: '2023-05-13', dueDate: '2023-05-20' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Pending Critiques</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Videos Awaiting Your Feedback</h2>
            <p className="text-gray-600">These videos have been assigned to you for critique</p>
          </div>
          
          <div className="divide-y">
            {pendingCritiques.length > 0 ? (
              pendingCritiques.map(critique => (
                <div key={critique.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{critique.title}</h3>
                    <p className="text-sm text-gray-500">Student: {critique.student}</p>
                    <p className="text-sm text-gray-500">Requested: {critique.requestedAt} • Due: {critique.dueDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to="/video-editor" className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90">
                      Start Video Editor
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>You don't have any pending critiques at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PendingCritiques;
