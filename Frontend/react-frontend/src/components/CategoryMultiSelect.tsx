import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategoryMultiSelectProps {
  categories: Category[] | undefined;
  value: string[];
  onChange: (values: string[]) => void;
}

function CategoryMultiSelect({ categories, value, onChange }: CategoryMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (id: string) => {
    if (value?.includes(id)) {
      onChange(value?.filter((v) => v !== id));
    } else {
      onChange([...(value || []), id]);
    }
  };

  const removeCategory = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const selectedCategories = categories?.filter((c) => value?.includes(c.id)) ?? [];
  const unselectedCategories = categories?.filter((c) => !value?.includes(c.id)) ?? [];

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCategories.map((category) => (
            <span 
                key={category.id} 
                className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 border border-indigo-200"
            >
              {category.name}
              <button
                type="button"
                className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-indigo-200 hover:text-indigo-800 transition-colors focus:outline-none"
                aria-label={`Remove ${category.name}`}
                onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(category.id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <span className="truncate text-slate-700 font-medium">
            {selectedCategories.length === 0 ? "Select categories..." : "Add more categories..."}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-white shadow-md outline-none animate-in fade-in-0 zoom-in-95">
             <ul className="max-h-60 overflow-auto p-1 text-sm text-slate-700">
                {unselectedCategories.length === 0 && (
                <li className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none text-slate-500 italic">
                    All categories selected
                </li>
                )}
                {unselectedCategories.map((category) => (
                <li key={category.id}>
                    <button
                    type="button"
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 text-left transition-colors"
                    onClick={() => {
                        toggleCategory(category.id);
                        setIsOpen(false);
                    }}
                    >
                    {category.name}
                    </button>
                </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryMultiSelect;