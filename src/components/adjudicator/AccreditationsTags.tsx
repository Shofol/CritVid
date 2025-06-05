import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AccreditationsTagsProps {
  accreditations: string[] | undefined;
  onChange: (accreditations: string[]) => void;
}

const AccreditationsTags: React.FC<AccreditationsTagsProps> = ({ 
  accreditations = [], 
  onChange 
}) => {
  const [newAccreditation, setNewAccreditation] = useState('');

  const handleAddAccreditation = () => {
    if (newAccreditation.trim() === '') return;
    
    // Don't add duplicates
    if (accreditations.includes(newAccreditation.trim())) {
      setNewAccreditation('');
      return;
    }
    
    const updatedAccreditations = [...accreditations, newAccreditation.trim()];
    onChange(updatedAccreditations);
    setNewAccreditation('');
  };

  const handleRemoveAccreditation = (index: number) => {
    const updatedAccreditations = accreditations.filter((_, i) => i !== index);
    onChange(updatedAccreditations);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAccreditation();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Add accreditation (e.g., RAD, APDA, Cecchetti)"
          value={newAccreditation}
          onChange={(e) => setNewAccreditation(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddAccreditation}
          disabled={newAccreditation.trim() === ''}
        >
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {accreditations.map((accreditation, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
            {accreditation}
            <button
              type="button"
              onClick={() => handleRemoveAccreditation(index)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
        {accreditations.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No accreditations added yet
          </span>
        )}
      </div>
    </div>
  );
};

export default AccreditationsTags;
