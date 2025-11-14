'use client';

import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Filter } from 'lucide-react';
import { useCallback } from 'react';

const categories = ['Concert', 'Conférence', 'Sport', 'Festival', 'Autre'];

export const EventFilters = ({
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
}) => {
  const handleCategoryToggle = (category) => {
  setSelectedCategories((prev) => {
    if (prev.includes(category)) {
      // Si la catégorie est déjà sélectionnée → on l'enlève (annule le filtre)
      return prev.filter((c) => c !== category);
    } else {
      // Sinon → on l'ajoute
      return [...prev, category];
    }
  });
};

  return (
    <Card className="p-6 space-y-6 sticky top-24 shadow-card">
      <div className="flex items-center gap-2 pb-4 border-b">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Filtres</h2>
      </div>

      {/* Catégories */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm">Catégories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Prix */}
      {/* <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">Prix</h3>
          <span className="text-sm text-muted-foreground">
            {priceRange[0]}€ - {priceRange[1]}€
          </span>
        </div>
        <Slider
          min={0}
          max={300}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
          className="w-full"
        />
      </div> */}
    </Card>
  );
};
