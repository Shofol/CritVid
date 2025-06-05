import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockVideoSubmissions } from '@/data/mockData';

const RecentVideos: React.FC = () => {
  // Ensure mockVideoSubmissions is an array before using array methods
  const videoSubmissions = Array.isArray(mockVideoSubmissions) ? mockVideoSubmissions : [];
  
  const recentVideos = [...videoSubmissions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recent Videos</h3>
        <Link to="/critique-editor">
          <Button variant="outline" size="sm">Open Critique Editor</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-slate-950 relative">
              <video 
                src={video.videoUrl} 
                className="w-full h-full object-cover"
                poster="/placeholder.svg"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold truncate">{video.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{video.danceStyle}</p>
              <div className="flex gap-2">
                <Link to={`/critique-editor/${video.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Link to={`/critique-editor/${video.id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    Edit Video
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentVideos;