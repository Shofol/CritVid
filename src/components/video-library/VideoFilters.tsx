import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoFilter } from '@/types/videoLibrary';

interface VideoFiltersProps {
  filters: VideoFilter;
  onFiltersChange: (filters: VideoFilter) => void;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleStyleChange = (value: string) => {
    onFiltersChange({ ...filters, style: value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search videos..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      
      <Select value={filters.style || 'All'} onValueChange={handleStyleChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Dance Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Styles</SelectItem>
          <SelectItem value="Ballet">Ballet</SelectItem>
          <SelectItem value="Contemporary">Contemporary</SelectItem>
          <SelectItem value="Hip Hop">Hip Hop</SelectItem>
          <SelectItem value="Jazz">Jazz</SelectItem>
          <SelectItem value="Breaking">Breaking</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filters.sortBy || 'date'} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="style">Style</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VideoFilters;