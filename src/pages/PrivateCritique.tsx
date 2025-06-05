import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';

const PrivateCritique: React.FC = () => {
  const { userRole, setUserRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // If user has studio_critique role, redirect them to the studio dashboard
    // Otherwise, set their role to studio_critique and redirect
    if (userRole === 'studio_critique') {
      navigate('/studio/dashboard');
    } else {
      setUserRole('studio_critique');
      // Short delay to allow the role change to propagate
      setTimeout(() => {
        navigate('/studio/dashboard');
      }, 100);
    }
  }, [userRole, setUserRole, navigate]);

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting to Studio Dashboard...</h1>
          <p>You'll be redirected to the Studio Dashboard automatically.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrivateCritique;
