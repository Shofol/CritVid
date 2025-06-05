import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/AppLayout';
import EditAdjudicatorDialog from '@/components/admin/EditAdjudicatorDialog';
import { mockAdjudicatorAdminProfiles } from '@/data/mockAdjudicatorData';
import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';

// Mock data for applications and flagged critiques
const mockApplications = [
  {
    id: '1',
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    styles: ['Ballroom', 'Latin'],
    credentials: 'Former professional dancer, 10+ years teaching experience',
    applicationDate: '2023-07-10',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Lisa Thompson',
    email: 'lisa.t@example.com',
    styles: ['Contemporary', 'Modern'],
    credentials: 'MFA in Dance, 5 years choreography experience',
    applicationDate: '2023-07-12',
    status: 'pending',
  },
];

const mockFlaggedCritiques = [
  {
    id: '1',
    adjudicatorName: 'Sarah Johnson',
    dancerName: 'Olivia Parker',
    title: 'Ballet Variation',
    reasonFlagged: 'Inappropriate comments',
    dateReported: '2023-07-14',
  },
];

const AdjudicatorAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [adjudicators, setAdjudicators] = useState(mockAdjudicatorAdminProfiles);
  const [selectedAdjudicator, setSelectedAdjudicator] = useState<AdjudicatorAdminProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const filteredAdjudicators = adjudicators.filter(adj => 
    adj.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (adjudicator: AdjudicatorAdminProfile) => {
    setSelectedAdjudicator(adjudicator);
    setIsEditDialogOpen(true);
  };

  const handleAdjudicatorUpdate = (updatedAdjudicator: AdjudicatorAdminProfile) => {
    // Update the adjudicator in the list
    const updatedAdjudicators = adjudicators.map(adj => 
      adj.id === updatedAdjudicator.id ? updatedAdjudicator : adj
    );
    setAdjudicators(updatedAdjudicators);
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    const updatedAdjudicators = adjudicators.map(adj => 
      adj.id === id ? { ...adj, accountStatus: isActive ? 'active' : 'suspended' } : adj
    );
    setAdjudicators(updatedAdjudicators);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Adjudicator Administration</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total Adjudicators" value={adjudicators.length.toString()} />
          <StatsCard title="Pending Applications" value={mockApplications.length.toString()} />
          <StatsCard title="Flagged Critiques" value={mockFlaggedCritiques.length.toString()} />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="adjudicators">
          <TabsList className="mb-4">
            <TabsTrigger value="adjudicators">Active Adjudicators</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="flagged">Flagged Critiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjudicators">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Adjudicators</h2>
              <div className="w-1/3">
                <Input 
                  placeholder="Search adjudicators..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Styles</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Critiques</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdjudicators.map((adjudicator) => (
                      <TableRow key={adjudicator.id}>
                        <TableCell className="font-medium">{adjudicator.fullName}</TableCell>
                        <TableCell>{adjudicator.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {adjudicator.danceStyles.map((style, index) => (
                              <Badge key={index} variant="outline">{style}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{adjudicator.rating} ⭐</TableCell>
                        <TableCell>{adjudicator.totalCritiques}</TableCell>
                        <TableCell>${adjudicator.totalEarnings}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id={`status-${adjudicator.id}`} 
                              checked={adjudicator.accountStatus === 'active'} 
                              onCheckedChange={(checked) => handleStatusToggle(adjudicator.id, checked)}
                            />
                            <span>{adjudicator.accountStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(adjudicator)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="flagged">
            <h2 className="text-xl font-semibold mb-4">Flagged Critiques</h2>
            {mockFlaggedCritiques.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mockFlaggedCritiques.map((critique) => (
                  <FlaggedCritiqueCard key={critique.id} critique={critique} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No flagged critiques at this time.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Adjudicator Dialog */}
        {selectedAdjudicator && (
          <EditAdjudicatorDialog 
            adjudicator={selectedAdjudicator}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onAdjudicatorUpdate={handleAdjudicatorUpdate}
          />
        )}
      </div>
    </AppLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

interface ApplicationCardProps {
  application: {
    id: string;
    name: string;
    email: string;
    styles: string[];
    credentials: string;
    applicationDate: string;
    status: string;
  };
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.name}</CardTitle>
            <CardDescription>{application.email}</CardDescription>
          </div>
          <Badge variant="outline">{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="text-sm font-semibold">Dance Styles:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {application.styles.map((style, index) => (
              <Badge key={index} variant="secondary">{style}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Credentials:</p>
          <p className="text-sm mt-1">{application.credentials}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Applied on: {application.applicationDate}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">View Details</Button>
        <Button variant="destructive">Reject</Button>
        <Button>Approve</Button>
      </CardFooter>
    </Card>
  );
};

interface FlaggedCritiqueCardProps {
  critique: {
    id: string;
    adjudicatorName: string;
    dancerName: string;
    title: string;
    reasonFlagged: string;
    dateReported: string;
  };
}

const FlaggedCritiqueCard: React.FC<FlaggedCritiqueCardProps> = ({ critique }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{critique.title}</CardTitle>
            <CardDescription>
              Adjudicator: {critique.adjudicatorName} | Dancer: {critique.dancerName}
            </CardDescription>
          </div>
          <Badge variant="destructive">Flagged</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm font-semibold">Reason Flagged:</p>
          <p className="text-sm mt-1">{critique.reasonFlagged}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Reported on: {critique.dateReported}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">View Critique</Button>
        <Button variant="secondary">Dismiss Flag</Button>
        <Button variant="destructive">Take Action</Button>
      </CardFooter>
    </Card>
  );
};

export default AdjudicatorAdmin;
