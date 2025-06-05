import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';

const ProfileEditorLink: React.FC = () => {
  return (
    <Link to="/adjudicator/profile">
      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
        <UserCog size={16} />
        <span>Edit Profile</span>
      </Button>
    </Link>
  );
};

export default ProfileEditorLink;
