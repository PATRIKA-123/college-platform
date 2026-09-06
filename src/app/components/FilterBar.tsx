'use client';

import { useEffect, useState } from 'react';

export type CategoryOption = {
  value: string;
  label: string;
  count: number;
};

type FilterBarProps = {
  search: string;
  state: string;
  minFee: string;
  maxFee: string;
  sort: string;
  categories: string[];
  categoryOptions: CategoryOption[];
  onSearchChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onMinFeeChange: (value: string) => void;
  onMaxFeeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onToggleCategory: (value: string) => void;
  onReset: () => void;
};

const stateOptions = [
  'All states',
  'Delhi',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Punjab',
  'Uttar Pradesh',
  'Gujarat',
  'Andhra Pradesh',
];

export default function FilterBar({
  search,
  state,
  minFee,
  maxFee,
  sort,
  categories,
  categoryOptions,
  onSearchChange,
  onStateChange,
  onMinFeeChange,
  onMaxFeeChange,
  onSortChange,
  onToggleCategory,
  onReset,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const appliedChips: Array<{ key: string; label: string; action: () => void }> = [];

  if (search.trim()) {
    appliedChips.push({
      key: 'search',
      label: `Search: ${search.trim()}`,
      action: () => onSearchChange(''),
    });
  }

  if (state) {
    appliedChips.push({
      key: 'state',
      label: `State: ${state}`,
      action: () => onStateChange(''),
    });
  }

  if (minFee || maxFee) {
    appliedChips.push({
      key: 'fee',
      label: `Fees: ₹${Number(minFee || 0).toLocaleString('en-IN')} - ₹${Number(maxFee || 1000000).toLocaleString('en-IN')}`,
      action: () => {
        onMinFeeChange('');
        onMaxFeeChange('1000000');
      },
    });
  }

  if (sort !== 'relevance') {
    const labelMap: Record<string, string> = {
      price_asc: 'Sort: Price low to high',
      price_desc: 'Sort: Price high to low',
      newest: 'Sort: Newest',
      rating_desc: 'Sort: Highest rated',
    };

    appliedChips.push({
      key: 'sort',
      label: labelMap[sort] || 'Sort: Relevance',
      action: () => onSortChange('relevance'),
    });
  }

  categories.forEach((category) => {
    appliedChips.push({
      key: `category-${category}`,
      label: `Category: ${category}`,
      action: () => onToggleCategory(category),
    });
  });

  const hasFilters = appliedChips.length > 0;

  const filterContent = (
    <div id="filter-panel" className="space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Filters</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Refine results</h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Global search</label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search colleges, cities, or states"
            aria-label="Search colleges"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">State</label>
        <select
          value={state}
          onChange={(event) => onStateChange(event.target.value)}
          aria-label="Filter by state"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
        >
          {stateOptions.map((option) => (
            <option key={option} value={option === 'All states' ? '' : option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Categories</label>
          <span className="text-xs text-slate-400">{categories.length} selected</span>
        </div>

        <div className="space-y-2">
          {categoryOptions.map((option) => {
            const checked = categories.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 transition hover:border-emerald-500/50 hover:bg-slate-800"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(option.value)}
                    aria-label={`Toggle ${option.label}`}
                    className="h-4 w-4 accent-emerald-400"
                  />
                  {option.label}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {option.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Fee range</label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">Min</label>
            <input
              type="number"
              min="0"
              step="50000"
              value={minFee}
              onChange={(event) => onMinFeeChange(event.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">Max</label>
            <input
              type="number"
              min="0"
              step="50000"
              value={maxFee}
              onChange={(event) => onMaxFeeChange(event.target.value)}
              placeholder="1000000"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1000000"
          step="50000"
          value={Number(maxFee || 1000000)}
          onChange={(event) => onMaxFeeChange(event.target.value)}
          className="h-2 w-full cursor-pointer accent-emerald-400"
          aria-label="Maximum fee"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sort by</label>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort results"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="md:hidden">
        <div className="sticky top-3 z-30 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-lg shadow-slate-950/30 backdrop-blur">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="filter-panel"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-left text-sm font-medium text-slate-100"
          >
            <span>Filter & Sort</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
              {appliedChips.length || 0}
            </span>
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {appliedChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.action}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
            >
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="hidden md:block">
        <aside className="sticky top-6 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/20">
          {filterContent}
        </aside>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden" aria-hidden={!mobileOpen}>
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-3xl border-t border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Filter & Sort</h2>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-slate-700 px-2 py-1 text-slate-300">
                Close
              </button>
            </div>
            {filterContent}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onReset} className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100">
                Reset
              </button>
              <button type="button" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
