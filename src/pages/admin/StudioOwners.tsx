import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { EditStudioDialog } from '@/components/admin/EditStudioDialog';
import { ViewStudioDialog } from '@/components/admin/ViewStudioDialog';
import { toast } from '@/hooks/use-toast';

interface Studio {
  id: number;
  name: string;
  owner: string;
  email: string;
  status: string;
  students: number;
}

const StudioOwners: React.FC = () => {
  const [studioOwners, setStudioOwners] = useState<Studio[]>([
    { id: 1, name: 'Dance Studio A', owner: 'Jane Smith', email: 'jane@dancestudioa.com', status: 'Active', students: 45 },
    { id: 2, name: 'Ballet Academy', owner: 'Robert Johnson', email: 'robert@balletacademy.com', status: 'Active', students: 78 },
    { id: 3, name: 'Modern Moves', owner: 'Sarah Williams', email: 'sarah@modernmoves.com', status: 'Pending', students: 32 },
    { id: 4, name: 'Rhythm Dance', owner: 'Michael Brown', email: 'michael@rhythmdance.com', status: 'Active', students: 56 },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  const handleEdit = (studio: Studio) => {
    setSelectedStudio(studio);
    setEditDialogOpen(true);
  };

  const handleView = (studio: Studio) => {
    setSelectedStudio(studio);
    setViewDialogOpen(true);
  };

  const handleSaveStudio = (updatedStudio: Studio) => {
    setStudioOwners(prev => 
      prev.map(studio => 
        studio.id === updatedStudio.id ? updatedStudio : studio
      )
    );
    toast({
      title: "Studio Updated",
      description: "Studio information has been successfully updated.",
    });
  };

  const handleAddNewStudio = () => {
    toast({
      title: "Add New Studio",
      description: "Add new studio functionality coming soon!",
    });
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Studio Owners Management</h1>
          <Button onClick={handleAddNewStudio}>Add New Studio</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Studio Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studioOwners.map((studio) => (
                  <TableRow key={studio.id}>
                    <TableCell>{studio.name}</TableCell>
                    <TableCell>{studio.owner}</TableCell>
                    <TableCell>{studio.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${studio.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {studio.status}
                      </span>
                    </TableCell>
                    <TableCell>{studio.students}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(studio)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(studio)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <EditStudioDialog
          studio={selectedStudio}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveStudio}
        />

        <ViewStudioDialog
          studio={selectedStudio}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      </div>
    </AppLayout>
  );
};

export default StudioOwners;