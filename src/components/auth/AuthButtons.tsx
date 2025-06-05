import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild variant="default" size="sm">
        <Link to="/signup">Sign up</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
