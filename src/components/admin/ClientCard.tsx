import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    joinDate: string;
    videosCount: number;
    critiquesCount: number;
    avatar?: string;
  };
  onViewDetails: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onViewDetails }) => {
  const getStatusBadge = () => {
    switch (client.status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{client.name}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium">Email:</span> {client.email}</p>
          <p className="text-sm"><span className="font-medium">Joined:</span> {client.joinDate}</p>
          <div className="flex justify-between mt-3">
            <div className="text-center">
              <p className="text-xl font-bold">{client.videosCount}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{client.critiquesCount}</p>
              <p className="text-xs text-muted-foreground">Critiques</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onViewDetails(client.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
