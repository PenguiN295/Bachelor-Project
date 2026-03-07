import { useState, useRef, useEffect } from "react";

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
    <div>
      <label>Categories</label>

      {selectedCategories.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {selectedCategories.map((category) => (
            <span key={category.id} className="badge bg-primary d-flex align-items-center gap-1" style={{ fontSize: "0.85rem" }}>
              {category.name}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.6rem" }}
                aria-label={`Remove ${category.name}`}
                onClick={() => removeCategory(category.id)}
              />
            </span>
          ))}
        </div>
      )}

      <div className="dropdown" ref={dropdownRef}>
        <button
          type="button"
          className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          {selectedCategories.length === 0
            ? "Select categories..."
            : `${selectedCategories.length} selected`}
        </button>

        {isOpen && (
          <ul className="dropdown-menu show w-100" style={{ maxHeight: "220px", overflowY: "auto" }}>
            {unselectedCategories.length === 0 && (
              <li><span className=" text-muted">All categories selected</span></li>
            )}
            {unselectedCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryMultiSelect;