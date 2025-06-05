import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Adjudicator } from '@/types/findAdjudicator';

interface AdjudicatorCardProps {
  adjudicator: Adjudicator;
  onSelect: (id: string) => void;
  onViewProfile: (adjudicator: Adjudicator) => void;
  showSendVideoButton?: boolean;
}

const AdjudicatorCard: React.FC<AdjudicatorCardProps> = ({ 
  adjudicator, 
  onSelect, 
  onViewProfile,
  showSendVideoButton = false
}) => {
  // Safely handle danceStyles array (prevent undefined.slice error)
  const danceStyles = adjudicator.danceStyles || [];
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/10">
      <CardHeader className="p-0">
        <div className="relative h-80 w-full overflow-hidden bg-muted">
          <img 
            src={adjudicator.profileImage} 
            alt={adjudicator.name}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-1">{adjudicator.name}</h3>
            <p className="text-base text-white/90 font-medium">{adjudicator.credentials}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-1 text-yellow-500 text-lg">★</span>
            <span className="font-semibold">{adjudicator.rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {adjudicator.totalCritiques} critiques
          </div>
          <div className="text-lg font-bold text-primary">
            ${adjudicator.price}/critique
          </div>
        </div>
        
        <div className="mb-4">
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {adjudicator.bio}
          </p>
        </div>
        
        <div className="mb-3 flex flex-wrap gap-2">
          {Array.isArray(danceStyles) && danceStyles.map((style) => (
            <Badge key={style} variant="secondary" className="text-xs px-2 py-1">
              {style}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {adjudicator.availability}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4 space-y-3">
        <Button 
          variant="outline"
          className="w-full" 
          onClick={() => onViewProfile(adjudicator)}
        >
          View Profile
        </Button>
        {showSendVideoButton ? (
          <Button 
            className="w-full" 
            onClick={() => onSelect(adjudicator.id)}
          >
            Send Video for Critique
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => onSelect(adjudicator.id)}
          >
            Select Adjudicator
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdjudicatorCard;