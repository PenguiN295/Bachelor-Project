import type React from "react";
import type { EventFilter } from "../Interfaces/EventFilter";
import CategoryMultiSelect from "./CategoryMultiSelect";
interface FilterProps {
    filters: EventFilter;
    categories: { id: string; name: string }[];
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterClear: () => void;
    handleCategoryChange: (categoryIds: string[]) => void;
}


const FilterComponent: React.FC<FilterProps> = ({ filters, categories, handleFilterChange, handleFilterClear, handleCategoryChange }) => {
    return <>
        <div className="filter-bar">
            <input
                type="text"
                name="search"
                placeholder="Search events..."
                value={filters.search}
                onChange={handleFilterChange}
            />
        </div>
        <label>
            <input
                name="showFull"
                type="checkbox"
                checked={filters.showFull}
                onChange={handleFilterChange}
            />
            Show Full Events
        </label>
        <div>
            <label>
                Starting date
                <div >
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
            </label>
        </div>
        <div>
            <label>
                Price
                <div >
                    <input
                        type="number"
                        name="price"
                        value={filters.price}
                        onChange={handleFilterChange}
                    />
                </div>
            </label>
        </div>
        <div>
            <label>
                Location
                <div >
                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                </div>
            </label>
        </div>
        <div>
            <button
                onClick={handleFilterClear}
                type="button" className="btn btn-danger btn-sm"
            >
                Clear All Filters
            </button>
        </div>
        <CategoryMultiSelect
            categories={categories}
            value={filters.categoryIds!}
            onChange={handleCategoryChange}
        />


    </>;
}

export default FilterComponent