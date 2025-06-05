import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, Video, MessageSquare, CreditCard } from 'lucide-react';
import SendMessageDialog from './SendMessageDialog';
import EditClientDialog from './EditClientDialog';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    joinDate: string;
    videosCount: number;
    critiquesCount: number;
    avatar?: string;
  } | null;
  onClientUpdate?: (updatedClient: any) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  client, 
  onClientUpdate 
}) => {
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [currentClient, setCurrentClient] = useState(client);

  useEffect(() => {
    setCurrentClient(client);
  }, [client]);

  if (!currentClient) return null;

  const getStatusBadge = () => {
    switch (currentClient.status) {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleClientUpdate = (updatedClient: any) => {
    setCurrentClient(updatedClient);
    if (onClientUpdate) {
      onClientUpdate(updatedClient);
    }
  };

  const handleSendMessage = () => {
    setShowSendMessage(true);
  };

  const handleEditClient = () => {
    setShowEditClient(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentClient.avatar} alt={currentClient.name} />
                <AvatarFallback className="text-lg">{getInitials(currentClient.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentClient.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{currentClient.email}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {currentClient.joinDate}</span>
                  {getStatusBadge()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{currentClient.videosCount}</p>
                      <p className="text-sm text-muted-foreground">Videos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{currentClient.critiquesCount}</p>
                      <p className="text-sm text-muted-foreground">Critiques</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">$240</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Client ID</p>
                        <p className="text-muted-foreground">{currentClient.id}</p>
                      </div>
                      <div>
                        <p className="font-medium">Account Status</p>
                        {getStatusBadge()}
                      </div>
                      <div>
                        <p className="font-medium">Last Login</p>
                        <p className="text-muted-foreground">2 hours ago</p>
                      </div>
                      <div>
                        <p className="font-medium">Subscription</p>
                        <p className="text-muted-foreground">Premium</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="videos">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Video history and details would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Payment transactions and billing information would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">User activity log would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={handleSendMessage}>
                Send Message
              </Button>
              <Button onClick={handleEditClient}>
                Edit Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SendMessageDialog
        isOpen={showSendMessage}
        onClose={() => setShowSendMessage(false)}
        clientName={currentClient.name}
        clientEmail={currentClient.email}
      />

      <EditClientDialog
        isOpen={showEditClient}
        onClose={() => setShowEditClient(false)}
        client={currentClient}
        onSave={handleClientUpdate}
      />
    </>
  );
};

export default ClientDetailsModal;