'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CollegeRow {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  establishedYear: number;
}

export default function AdminDashboardPage() {
  const [colleges, setColleges] = useState<CollegeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchColleges = async () => {
      try {
        const response = await fetch('/api/colleges');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load colleges');
        }

        if (isMounted) {
          setColleges(Array.isArray(result.data) ? result.data : []);
        }
      } catch (error) {
        console.error('Failed to fetch colleges:', error);

        if (isMounted) {
          setColleges([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchColleges();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (slug: string) => {
    const confirmed = window.confirm(`Delete college: ${slug}?`);
    if (!confirmed) return;

    setDeletingId(slug);

    try {
      const response = await fetch(`/api/colleges/${slug}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      setColleges((current) => current.filter((college) => college.slug !== slug));
    } catch (error) {
      console.error('Failed to delete college:', error);
      alert(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-400">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">College management</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/add-college"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              + Add college
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-white"
            >
              View site
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-emerald-950/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left">
              <thead className="bg-slate-950/80">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">College</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Location</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Fees</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Rating</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Year</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      Loading colleges...
                    </td>
                  </tr>
                ) : colleges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No colleges found.
                    </td>
                  </tr>
                ) : (
                  colleges.map((college) => (
                    <tr key={college.id} className="hover:bg-slate-800/50">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-white">{college.name}</p>
                          <p className="text-sm text-slate-400">/{college.slug}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {college.location}, {college.state}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        ₹{Number(college.fees).toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {college.rating.toFixed(1)} ★
                      </td>

                      <td className="px-5 py-4 text-slate-300">{college.establishedYear}</td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/colleges/${college.slug}`}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-emerald-500 hover:text-white"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(college.slug)}
                            disabled={deletingId === college.slug}
                            className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === college.slug ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
