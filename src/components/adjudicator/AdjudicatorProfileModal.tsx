import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Adjudicator } from '@/types/findAdjudicator';
import { Star, Clock, DollarSign, Award } from 'lucide-react';
import { VideoAssignmentModal } from './VideoAssignmentModal';
import { AdjudicatorReviewList } from './AdjudicatorReviewList';
import { VideoSubmissionExtended } from '@/types/videoLibrary';
import { mockVideos } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

interface AdjudicatorProfileModalProps {
  adjudicator: Adjudicator | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (id: string) => void;
  showSelectButton?: boolean;
  showSendVideoButton?: boolean;
}

const AdjudicatorProfileModal: React.FC<AdjudicatorProfileModalProps> = ({
  adjudicator,
  isOpen,
  onClose,
  onSelect,
  showSelectButton = false,
  showSendVideoButton = false
}) => {
  const [showVideoAssignment, setShowVideoAssignment] = useState(false);

  if (!adjudicator) return null;

  const handleSendVideoForCritique = () => {
    setShowVideoAssignment(true);
  };

  const handleAssignVideo = (videoId: string, adjudicatorId: string) => {
    // Update video status to assigned
    toast({
      title: 'Video Assigned',
      description: `Video has been sent to ${adjudicator.name} for critique.`
    });
    setShowVideoAssignment(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showVideoAssignment} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Adjudicator Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <img 
                src={adjudicator.profileImage} 
                alt={adjudicator.name}
                className="w-32 h-32 rounded-lg object-cover object-top shadow-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{adjudicator.name}</h2>
                <p className="text-lg text-muted-foreground mb-3">{adjudicator.credentials}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold">{adjudicator.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {adjudicator.totalCritiques} critiques completed
                  </span>
                </div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                  {adjudicator.availability}
                </p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{adjudicator.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Dance Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {adjudicator.danceStyles.map((style) => (
                      <Badge key={style} variant="secondary" className="px-3 py-1">{style}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">15+ Years</div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">${adjudicator.price}</div>
                    <div className="text-sm text-muted-foreground">Per Critique</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">2-3 Days</div>
                    <div className="text-sm text-muted-foreground">Turnaround</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <AdjudicatorReviewList adjudicatorId={adjudicator.id} />
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              {showSendVideoButton && (
                <Button 
                  onClick={handleSendVideoForCritique}
                  className="flex-1"
                >
                  Send Video for Critique
                </Button>
              )}
              {showSelectButton && onSelect && (
                <Button 
                  onClick={() => onSelect(adjudicator.id)} 
                  className="flex-1"
                >
                  Select This Adjudicator
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VideoAssignmentModal
        isOpen={showVideoAssignment}
        onClose={() => setShowVideoAssignment(false)}
        selectedAdjudicator={adjudicator}
        videos={mockVideos}
        onAssignVideo={handleAssignVideo}
      />
    </>
  );
};

export default AdjudicatorProfileModal;