import React from 'react';
import AppLayout from '@/components/AppLayout';

const CompletedCritiques: React.FC = () => {
  // Mock data for completed critiques
  const completedCritiques = [
    { id: 1, title: 'Tap Dance Solo', student: 'Sarah Williams', completedAt: '2023-05-10', status: 'completed' },
    { id: 2, title: 'Ballet Variation', student: 'James Miller', completedAt: '2023-05-05', status: 'completed' },
    { id: 3, title: 'Hip Hop Group Performance', student: 'Urban Dance Crew', completedAt: '2023-04-28', status: 'completed' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Completed Critiques</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Your Completed Video Critiques</h2>
            <p className="text-gray-600">History of videos you've critiqued</p>
          </div>
          
          <div className="divide-y">
            {completedCritiques.length > 0 ? (
              completedCritiques.map(critique => (
                <div key={critique.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{critique.title}</h3>
                    <p className="text-sm text-gray-500">Student: {critique.student}</p>
                    <p className="text-sm text-gray-500">Completed: {critique.completedAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>You haven't completed any critiques yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CompletedCritiques;
