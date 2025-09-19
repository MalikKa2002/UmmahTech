import { useState } from 'react';
import { DealFilters as DealFiltersType, DealCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Filter, X } from 'lucide-react';

interface DealFiltersProps {
  filters: DealFiltersType;
  onFiltersChange: (filters: DealFiltersType) => void;
  totalDeals: number;
  filteredCount: number;
}

const DealFilters = ({ filters, onFiltersChange, totalDeals, filteredCount }: DealFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categories: { value: DealCategory; label: string; icon: string }[] = [
    { value: 'food', label: 'Food', icon: '🍞' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'services', label: 'Services', icon: '🔧' },
  ];

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 2, label: '2 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
  ];

  const updateFilters = (update: Partial<DealFiltersType>) => {
    onFiltersChange({ ...filters, ...update });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {filteredCount} of {totalDeals} deals
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick Filters (Always Visible) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filters.freeOnly ? "donation" : "outline"}
            size="sm"
            onClick={() => updateFilters({ freeOnly: !filters.freeOnly })}
            className="flex items-center gap-1"
          >
            <span>💝</span>
            Free Only
          </Button>

          {categories.map(({ value, label, icon }) => (
            <Button
              key={value}
              variant={filters.category === value ? "secondary" : "outline"}
              size="sm"
              onClick={() => updateFilters({ 
                category: filters.category === value ? undefined : value 
              })}
              className="flex items-center gap-1"
            >
              <span>{icon}</span>
              {label}
            </Button>
          ))}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Distance Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Distance
              </Label>
              <Select
                value={filters.radius?.toString() || ""}
                onValueChange={(value) => updateFilters({ 
                  radius: value ? parseInt(value) : undefined 
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any distance</SelectItem>
                  {radiusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      Within {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Info */}
            {filters.userLocation && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                📍 Filtering by your location in Tel Aviv
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.freeOnly && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Free Only
                <button 
                  onClick={() => updateFilters({ freeOnly: false })}
                  className="ml-1 hover:bg-success/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.category && (
              <Badge variant="outline">
                {categories.find(c => c.value === filters.category)?.icon} {' '}
                {categories.find(c => c.value === filters.category)?.label}
                <button 
                  onClick={() => updateFilters({ category: undefined })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.radius && (
              <Badge variant="outline">
                📍 {radiusOptions.find(r => r.value === filters.radius)?.label}
                <button 
                  onClick={() => updateFilters({ radius: undefined })}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealFilters;