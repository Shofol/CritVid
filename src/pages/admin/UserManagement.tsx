import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/components/AppLayout';
import EditUserDialog from '@/components/admin/EditUserDialog';
import { User } from '@/types/user';
import { mockUserData } from '@/data/mockUserData';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>(mockUserData);
  
  // State for edit user dialog
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setIsEditDialogOpen(true);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    // Update the users array with the updated user
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Search by name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="adjudicator">Adjudicator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <select 
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Critiques</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>{user.dateJoined}</TableCell>
                    <TableCell>{user.videosUploaded}</TableCell>
                    <TableCell>{user.critiquesReceived}</TableCell>
                    <TableCell>
                      <UserActions 
                        userId={user.id} 
                        onEditUser={handleEditUser}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        {editingUser && (
          <EditUserDialog
            user={editingUser}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onUserUpdate={handleUserUpdate}
          />
        )}
      </div>
    </AppLayout>
  );
};

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-purple-500">Admin</Badge>;
    case 'adjudicator':
      return <Badge className="bg-blue-500">Adjudicator</Badge>;
    case 'user':
    default:
      return <Badge variant="outline">User</Badge>;
  }
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>;
    case 'suspended':
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Suspended</Badge>;
    case 'deleted':
      return <Badge variant="outline" className="text-red-500 border-red-500">Deleted</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface UserActionsProps {
  userId: string;
  onEditUser: (userId: string) => void;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, onEditUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditUser(userId)}>Edit User</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(`View details for ${userId}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(`Reset password for ${userId}`)}>Reset Password</DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-500"
          onClick={() => console.log(`Deactivate user ${userId}`)}
        >
          Deactivate Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserManagement;
