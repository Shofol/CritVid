import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AdjudicatorFilter } from '@/types/findAdjudicator';
import { danceStyleOptions } from '@/data/adjudicatorData';

interface AdjudicatorFiltersProps {
  onFilterChange: (filters: AdjudicatorFilter) => void;
}

const AdjudicatorFilters: React.FC<AdjudicatorFiltersProps> = ({ onFilterChange }) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState<number>(0);

  const handleStyleChange = (style: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(style)) {
        return prev.filter(s => s !== style);
      } else {
        return [...prev, style];
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      danceStyles: selectedStyles,
      priceRange: priceRange,
      rating: minRating
    });
  };

  const handleClearFilters = () => {
    setSelectedStyles([]);
    setPriceRange([0, 100]);
    setMinRating(0);
    onFilterChange({
      danceStyles: [],
      priceRange: [0, 100],
      rating: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Adjudicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Dance Styles</h3>
            <div className="grid grid-cols-2 gap-2">
              {danceStyleOptions.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`style-${style}`} 
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={() => handleStyleChange(style)}
                  />
                  <Label htmlFor={`style-${style}`} className="text-sm">
                    {style}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={5}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
              <div className="flex justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Minimum Rating</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0]}
                max={5}
                step={0.5}
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                className="py-4"
              />
              <div className="flex items-center space-x-1">
                <span className="text-sm">{minRating.toFixed(1)}</span>
                <span className="text-yellow-500">★</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorFilters;
