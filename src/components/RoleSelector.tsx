import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface RoleSelectorProps {
  onRoleSelect?: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const { setUserRole } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    setUserRole(role as any);
    if (onRoleSelect) {
      onRoleSelect(role);
    }
    
    // Navigate to the appropriate dashboard based on role
    switch (role) {
      case 'client':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'adjudicator':
        navigate('/adjudicator/dashboard');
        break;
      case 'studio_critique':
        navigate('/studio/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Log the current role selection process for debugging
  useEffect(() => {
    console.log('RoleSelector component mounted');
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Client</CardTitle>
          <CardDescription>For dancers and students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upload videos and receive professional critiques from adjudicators.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleRoleSelect('client')} className="w-full">
            Select Client Role
          </Button>
        </CardFooter>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Adjudicator</CardTitle>
          <CardDescription>For dance professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Provide expert feedback on dance videos and earn money.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleRoleSelect('adjudicator')} className="w-full">
            Select Adjudicator Role
          </Button>
        </CardFooter>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Studio Critique</CardTitle>
          <CardDescription>For dance teachers and studios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create and manage critiques for your own students and classes.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleRoleSelect('studio_critique')} className="w-full">
            Select Studio Role
          </Button>
        </CardFooter>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>For platform administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage users, content, and platform settings.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleRoleSelect('admin')} className="w-full">
            Select Admin Role
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSelector;
