import type React from "react";
import type { EventFilter } from "../Interfaces/EventFilter";
interface FilterProps {
    filters: EventFilter;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterClear: () =>void ;
}


const FilterComponent: React.FC<FilterProps> = ({ filters, handleFilterChange,handleFilterClear }) => {
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


    </>;
}

export default FilterComponent