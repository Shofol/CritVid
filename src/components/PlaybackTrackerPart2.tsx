import React from 'react';

interface VideoAction {
  type: 'play' | 'pause' | 'seek' | 'audio_start' | 'audio_stop';
  time: number;
  timestamp: number;
}

interface PlaybackTrackerTableProps {
  actions: VideoAction[];
}

const PlaybackTrackerTable: React.FC<PlaybackTrackerTableProps> = ({ actions }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'play': return 'bg-green-100 text-green-800';
      case 'pause': return 'bg-red-100 text-red-800';
      case 'seek': return 'bg-blue-100 text-blue-800';
      case 'audio_start': return 'bg-purple-100 text-purple-800';
      case 'audio_stop': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Tracked Actions ({actions.length})</h3>
      {actions.length === 0 ? (
        <p className="text-gray-500 italic">No actions recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Action Type
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Video Time (s)
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {actions.slice().reverse().map((action, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(action.type)}`}>
                      {action.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {action.time.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {formatTimestamp(action.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlaybackTrackerTable;