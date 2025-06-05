import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocialMediaLinksProps {
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  } | undefined;
  onChange: (socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  }) => void;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialMedia = {}, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...socialMedia,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          name="instagram"
          placeholder="https://instagram.com/yourusername"
          value={socialMedia.instagram || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          id="facebook"
          name="facebook"
          placeholder="https://facebook.com/yourusername"
          value={socialMedia.facebook || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          name="linkedin"
          placeholder="https://linkedin.com/in/yourusername"
          value={socialMedia.linkedin || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Personal Website</Label>
        <Input
          id="website"
          name="website"
          placeholder="https://yourwebsite.com"
          value={socialMedia.website || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SocialMediaLinks;
