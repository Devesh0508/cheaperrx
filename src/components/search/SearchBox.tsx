"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Suggestion {
  id: string;
  display_name: string;
  subtitle: string;
  /** Full navigation URL — either /search?q=... or /pharmacy/[id] */
  href: string;
  type: "drug" | "pharmacy";
}

interface SearchBoxProps {
  size?: "hero" | "compact";
  defaultValue?: string;
  placeholder?: string;
  /** Base path for search navigation, defaults to /search */
  action?: string;
}

export function SearchBox({
  size = "hero",
  defaultValue = "",
  placeholder,
  action = "/search",
}: SearchBoxProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    try {
      const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(q)}`);
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 220);
    return () => clearTimeout(debounceRef.current);
  }, [value, fetchSuggestions]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function go(suggestion?: Suggestion) {
    setOpen(false);
    setActiveIndex(-1);
    if (suggestion) {
      router.push(suggestion.href);
    } else {
      const term = value.trim();
      if (!term) { inputRef.current?.focus(); return; }
      const base = action.includes("?") ? action + "&" : action + "?";
      router.push(`${base}q=${encodeURIComponent(term)}`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(activeIndex >= 0 ? suggestions[activeIndex] : undefined);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const isHero = size === "hero";
  const defaultPlaceholder = isHero
    ? "Search a drug or pharmacy (e.g. Lipitor, Costco, Shoppers)"
    : "Search a drug or pharmacy...";

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search for a medication"
        className={`flex gap-0 w-full ${isHero ? "shadow-lg rounded-2xl" : "rounded-xl shadow-sm"}`}
      >
        <label htmlFor="drug-search" className="sr-only">
          Search for a medication
        </label>
        <input
          ref={inputRef}
          id="drug-search"
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          placeholder={placeholder ?? defaultPlaceholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-controls={open ? "autocomplete-list" : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          className={`flex-1 border-2 border-r-0 border-gray-300 focus:border-[#0891B2] outline-none transition-colors text-[#1a1a2e] placeholder-gray-400 font-medium bg-white ${
            isHero
              ? "rounded-l-2xl px-6 py-5 text-xl min-h-[72px]"
              : "rounded-l-xl px-5 py-4 text-lg min-h-[56px]"
          }`}
        />
        <button
          type="submit"
          className={`bg-[#0891B2] hover:bg-[#0e7490] active:bg-[#0e7490] text-white font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
            isHero
              ? "rounded-r-2xl px-7 py-5 text-xl min-h-[72px]"
              : "rounded-r-xl px-5 py-4 text-lg min-h-[56px]"
          }`}
          aria-label="Search for medication prices"
        >
          Search Prices
          <span aria-hidden="true">→</span>
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id="autocomplete-list"
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => go(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                i === activeIndex ? "bg-[#e0f2fe]" : "hover:bg-gray-50"
              }`}
            >
              {/* Icon: pill for drugs, building for pharmacies */}
              <span className="text-2xl flex-shrink-0" aria-hidden="true">
                {s.type === "pharmacy" ? "🏥" : "💊"}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-semibold text-[#1a1a2e] text-lg leading-snug">
                  {s.display_name}
                </span>
                <span className="text-gray-400 text-sm truncate">{s.subtitle}</span>
              </span>
              {s.type === "pharmacy" && (
                <span className="ml-auto flex-shrink-0 text-xs font-semibold text-[#0891B2] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
                  Browse store
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
