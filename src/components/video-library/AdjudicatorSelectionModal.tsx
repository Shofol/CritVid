import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { mockAdjudicatorData } from '@/data/mockAdjudicatorData';
import { Adjudicator } from '@/types/adjudicator';
import { Star } from 'lucide-react';

interface AdjudicatorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAdjudicator: (adjudicator: Adjudicator) => void;
  videoTitle?: string;
}

export function AdjudicatorSelectionModal({
  isOpen,
  onClose,
  onSelectAdjudicator,
  videoTitle
}: AdjudicatorSelectionModalProps) {
  const handleSelectAdjudicator = (adjudicator: Adjudicator) => {
    onSelectAdjudicator(adjudicator);
    toast({
      title: 'Adjudicator Selected',
      description: `${adjudicator.name} has been assigned to critique your video.`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Select an Adjudicator
            {videoTitle && <span className="text-muted-foreground"> for "{videoTitle}"</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {mockAdjudicatorData.map((adjudicator) => (
            <Card key={adjudicator.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={adjudicator.profileImage} alt={adjudicator.name} />
                    <AvatarFallback>
                      {adjudicator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{adjudicator.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{adjudicator.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({adjudicator.totalCritiques} critiques)
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {adjudicator.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {adjudicator.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">${adjudicator.price}</span>
                        <span className="text-muted-foreground"> • </span>
                        <span className="text-muted-foreground">
                          {adjudicator.turnaroundTime}h turnaround
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => handleSelectAdjudicator(adjudicator)}
                        size="sm"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}