import React from "react";
import type { EventFilter } from "../Interfaces/EventFilter";
import CategoryMultiSelect from "./CategoryMultiSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, DollarSign, FilterX } from "lucide-react";

interface FilterProps {
    filters: EventFilter;
    categories: { id: string; name: string }[];
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterClear: () => void;
    handleCategoryChange: (categoryIds: string[]) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ filters, categories, handleFilterChange, handleFilterClear, handleCategoryChange }) => {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FilterX className="w-5 h-5 text-primary" />
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-slate-600">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="search"
                            type="text"
                            name="search"
                            placeholder="Find events..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-600">Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="location"
                            type="text"
                            name="location"
                            placeholder="City or County"
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-slate-600">Starting Date</Label>
                    <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-600">Max Price</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="price"
                            type="number"
                            name="price"
                            min="0"
                            placeholder="0 for free"
                            value={filters.price}
                            onChange={handleFilterChange}
                            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label className="text-slate-600">Categories</Label>
                    <CategoryMultiSelect
                        categories={categories}
                        value={filters.categoryIds || []}
                        onChange={handleCategoryChange}
                    />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input
                        id="showFull"
                        name="showFull"
                        type="checkbox"
                        checked={filters.showFull}
                        onChange={handleFilterChange}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <Label htmlFor="showFull" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Show Full Events
                    </Label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleFilterClear}
                    >
                        Clear All Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default FilterComponent;