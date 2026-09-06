'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import FilterBar, { CategoryOption } from '@/app/components/FilterBar';

interface Course {
  id: string;
  name: string;
  fees: number;
}

interface Placement {
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
}

interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  establishedYear: number;
  courses: Course[];
  placement: Placement | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const categoryOptions: CategoryOption[] = [
  { value: 'engineering', label: 'Engineering', count: 12 },
  { value: 'management', label: 'Management', count: 8 },
  { value: 'medical', label: 'Medical', count: 5 },
  { value: 'design', label: 'Design', count: 4 },
  { value: 'science', label: 'Science', count: 7 },
  { value: 'commerce', label: 'Commerce', count: 6 },
];

const DEFAULT_MAX_FEE = '1000000';

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [minFee, setMinFee] = useState('');
  const [maxFee, setMaxFee] = useState(DEFAULT_MAX_FEE);
  const [sort, setSort] = useState('relevance');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('search') || '');
    setState(params.get('state') || '');
    setMinFee(params.get('minFee') || '');
    setMaxFee(params.get('maxFee') || DEFAULT_MAX_FEE);
    setSort(params.get('sort') || 'relevance');
    setCategories((params.get('categories') || '').split(',').filter(Boolean));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (state) params.set('state', state);
    if (minFee) params.set('minFee', minFee);
    if (maxFee && maxFee !== DEFAULT_MAX_FEE) params.set('maxFee', maxFee);
    if (sort && sort !== 'relevance') params.set('sort', sort);
    if (categories.length) params.set('categories', categories.join(','));

    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState({}, '', `${url.pathname}${url.search}`);
  }, [search, state, minFee, maxFee, sort, categories]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (state) params.set('state', state);
      if (minFee) params.set('minFee', minFee);
      if (maxFee && maxFee !== DEFAULT_MAX_FEE) params.set('maxFee', maxFee);
      if (sort && sort !== 'relevance') params.set('sort', sort);
      if (categories.length) params.set('categories', categories.join(','));
      params.set('page', String(page));
      params.set('limit', '6');

      const response = await fetch(`/api/colleges?${params.toString()}`);
      const responseData = await response.json();

      if (response.ok && Array.isArray(responseData.data)) {
        setColleges(responseData.data);
        setPagination(
          responseData.pagination || {
            page,
            limit: 6,
            total: responseData.data.length,
            totalPages: 1,
          },
        );
      } else if (Array.isArray(responseData)) {
        setColleges(responseData);
      } else {
        setColleges([]);
      }
    } catch (error) {
      console.error('Failed to fetch colleges', error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [search, state, minFee, maxFee, sort, categories, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const toggleCategory = (value: string) => {
    setCategories((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setState('');
    setMinFee('');
    setMaxFee(DEFAULT_MAX_FEE);
    setSort('relevance');
    setCategories([]);
    setPage(1);
  };

  const loadingSkeleton = Array.from({ length: 6 }, (_, index) => index);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Discover colleges
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            College Discovery Platform
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Explore campuses, compare fees, evaluate outcomes, and filter options based on your priorities.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <FilterBar
            search={search}
            state={state}
            minFee={minFee}
            maxFee={maxFee}
            sort={sort}
            categories={categories}
            categoryOptions={categoryOptions}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onStateChange={(value) => {
              setState(value);
              setPage(1);
            }}
            onMinFeeChange={(value) => {
              setMinFee(value);
              setPage(1);
            }}
            onMaxFeeChange={(value) => {
              setMaxFee(value || DEFAULT_MAX_FEE);
              setPage(1);
            }}
            onSortChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            onToggleCategory={toggleCategory}
            onReset={handleReset}
          />

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <span>
                Showing <strong className="text-white">{loading ? '...' : colleges.length}</strong> colleges
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                {pagination.total || 0} total
              </span>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {loadingSkeleton.map((item) => (
                  <div key={item} className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-4 h-5 w-2/3 rounded bg-slate-800" />
                    <div className="mb-2 h-4 w-1/2 rounded bg-slate-800" />
                    <div className="mb-5 h-20 rounded bg-slate-800" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 rounded bg-slate-800" />
                      <div className="h-12 rounded bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
                <p className="text-2xl font-semibold text-white">No results found.</p>
                <p className="mt-2 text-slate-400">Try clearing filters or broadening your search criteria.</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {colleges.map((college) => (
                    <article
                      key={college.id}
                      className="group rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-emerald-950/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white">{college.name}</h2>
                          <p className="mt-1 text-sm text-slate-400">
                            {college.location}, {college.state}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                          ★ {college.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{college.description}</p>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-slate-950/70 p-3">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Fees</p>
                          <p className="mt-2 font-semibold text-white">₹{college.fees.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-950/70 p-3">
                          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Placement</p>
                          <p className="mt-2 font-semibold text-white">
                            {college.placement ? `₹${college.placement.averagePackage} LPA` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
                        <span className="text-sm text-slate-400">{college.courses.length} courses</span>
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          View details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => Math.max(current - 1, 1))}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <span>
                      Page <strong className="text-white">{pagination.page}</strong> of{' '}
                      <strong className="text-white">{pagination.totalPages}</strong>
                    </span>

                    <button
                      type="button"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((current) => Math.min(current + 1, pagination.totalPages))}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
