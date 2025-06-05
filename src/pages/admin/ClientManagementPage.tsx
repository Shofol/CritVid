import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import ClientCard from '@/components/admin/ClientCard';
import ClientDetailsModal from '@/components/admin/ClientDetailsModal';

// Mock data for clients
const mockClients = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    status: 'active' as const,
    joinDate: '2023-03-10',
    videosCount: 12,
    critiquesCount: 8,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    status: 'active' as const,
    joinDate: '2023-04-15',
    videosCount: 5,
    critiquesCount: 3,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    status: 'inactive' as const,
    joinDate: '2023-02-22',
    videosCount: 3,
    critiquesCount: 2,
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    status: 'pending' as const,
    joinDate: '2023-05-05',
    videosCount: 0,
    critiquesCount: 0,
  },
];

const ClientManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter clients based on search term and status filter
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Count clients by status
  const activeCount = mockClients.filter(c => c.status === 'active').length;
  const inactiveCount = mockClients.filter(c => c.status === 'inactive').length;
  const pendingCount = mockClients.filter(c => c.status === 'pending').length;
  
  const handleViewDetails = (id: string) => {
    const client = mockClients.find(c => c.id === id);
    if (client) {
      setSelectedClient(client);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Client Management</h1>
        
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatusCard title="Active Clients" count={activeCount} />
          <StatusCard title="Inactive Clients" count={inactiveCount} />
          <StatusCard title="Pending Activation" count={pendingCount} />
        </div>
        
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <select 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(client => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            
            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No clients match your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients
                .filter(client => client.status === 'active')
                .map(client => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients
                .filter(client => client.status === 'inactive')
                .map(client => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Client Details Modal */}
        <ClientDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          client={selectedClient}
        />
      </div>
    </AppLayout>
  );
};

interface StatusCardProps {
  title: string;
  count: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

export default ClientManagementPage;