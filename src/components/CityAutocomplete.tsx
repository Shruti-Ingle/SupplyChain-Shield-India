"use client";

import { useState, useEffect, useRef } from "react";
import { filterCities, formatCity, type City } from "@/lib/cities";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "City, State",
  required,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    onChange(v);
    setSuggestions(filterCities(v));
    setOpen(true);
  };

  const selectCity = (city: City) => {
    const formatted = formatCity(city);
    setQuery(formatted);
    onChange(formatted);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        className="input-field"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          setSuggestions(filterCities(query));
          setOpen(true);
        }}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-sage-200 rounded-xl shadow-card max-h-48 overflow-y-auto">
          {suggestions.map((city) => (
            <li key={`${city.name}-${city.state}`}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-sage-50 text-sm text-sage-800 transition-colors"
                onClick={() => selectCity(city)}
              >
                {formatCity(city)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
