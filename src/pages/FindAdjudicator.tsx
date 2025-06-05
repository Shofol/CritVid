import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Award, Eye, Send } from 'lucide-react';
import { mockAdjudicatorData } from '@/data/mockAdjudicatorData';
import { mockData } from '@/data/mockData';
import { VideoSelectionModal } from '@/components/video-library/VideoSelectionModal';

const FindAdjudicator: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedAdjudicator, setSelectedAdjudicator] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showVideoSelection, setShowVideoSelection] = useState(false);

  const adjudicators = mockAdjudicatorData;
  const videoId = searchParams.get('video');

  const handleViewProfile = (adjudicator: any) => {
    setSelectedAdjudicator(adjudicator);
    setShowProfile(true);
  };

  const handleSendVideo = (adjudicator: any) => {
    setSelectedAdjudicator(adjudicator);
    if (videoId) {
      // If coming from a specific video, go directly to checkout
      navigate(`/checkout/${videoId}/${adjudicator.id}`);
    } else {
      // Show video selection modal
      setShowVideoSelection(true);
    }
  };

  const handleUploadNew = () => {
    navigate(`/upload-video?adjudicator=${selectedAdjudicator?.id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find an Adjudicator</h1>
          <p className="text-gray-600">Choose from our certified dance adjudicators</p>
          {videoId && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Selecting adjudicator for your video</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adjudicators.map((adjudicator) => (
            <Card key={adjudicator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={adjudicator.avatar}
                    alt={adjudicator.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{adjudicator.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{adjudicator.rating}</span>
                      <span>({adjudicator.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{adjudicator.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {adjudicator.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {adjudicator.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{adjudicator.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">{adjudicator.experience} years experience</span>
                </div>
                
                <div className="text-lg font-semibold text-green-600">
                  ${adjudicator.rate}/critique
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewProfile(adjudicator)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Profile
                  </Button>
                  <Button
                    onClick={() => handleSendVideo(adjudicator)}
                    size="sm"
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {videoId ? 'Select' : 'Send Video'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Modal */}
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adjudicator Profile</DialogTitle>
            </DialogHeader>
            {selectedAdjudicator && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAdjudicator.avatar}
                    alt={selectedAdjudicator.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedAdjudicator.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedAdjudicator.rating} ({selectedAdjudicator.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedAdjudicator.location}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-gray-600">{selectedAdjudicator.bio}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdjudicator.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Experience</h4>
                    <p className="text-gray-600">{selectedAdjudicator.experience} years</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rate</h4>
                    <p className="text-green-600 font-semibold">${selectedAdjudicator.rate}/critique</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleSendVideo(selectedAdjudicator)} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Video for Critique
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Video Selection Modal */}
        {selectedAdjudicator && (
          <VideoSelectionModal
            isOpen={showVideoSelection}
            onClose={() => setShowVideoSelection(false)}
            videos={mockData.videos}
            selectedAdjudicator={selectedAdjudicator}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default FindAdjudicator;